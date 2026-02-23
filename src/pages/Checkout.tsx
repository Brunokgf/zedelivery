import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, QrCode, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";

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

  const deliveryFee = 5.99;
  const total = totalPrice + deliveryFee;

  const isFormValid =
    address.street.trim() !== "" &&
    address.number.trim() !== "" &&
    address.neighborhood.trim() !== "" &&
    address.city.trim() !== "";

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!isFormValid) {
      toast({ title: "Preencha o endereço de entrega", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("send-order-email", {
        body: {
          items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
          address,
          paymentMethod: payment,
          subtotal: totalPrice,
          deliveryFee,
          total,
        },
      });
      if (error) throw error;
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

      <div className="container py-6 space-y-6 max-w-2xl">
        {/* Address */}
        <section className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h2 className="flex items-center gap-2 text-base font-black text-card-foreground">
            <MapPin className="h-5 w-5 text-ze-orange" />
            Endereço de Entrega
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="CEP"
              value={address.cep}
              onChange={(e) => setAddress({ ...address, cep: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              maxLength={9}
            />
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

        {/* Payment */}
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

        {/* CTA */}
        <button
          onClick={handlePlaceOrder}
          disabled={!isFormValid || loading}
          className="w-full rounded-full bg-ze-green py-4 text-center font-black text-white text-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Enviando..." : `Confirmar Pedido — R$ ${total.toFixed(2).replace(".", ",")}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
