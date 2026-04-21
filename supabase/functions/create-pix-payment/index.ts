import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, description, items, customer } = await req.json();

    const secretKey = Deno.env.get("MEDUSAPAY_SECRET_KEY");
    if (!secretKey) {
      throw new Error("MEDUSAPAY_SECRET_KEY not configured");
    }

    const auth = btoa(`${secretKey}:x`);

    // Build items array (MedusaPay max 5). If more, consolidate into a single item
    // so the sum of unitPrice * quantity always matches `amount`.
    let transactionItems;
    if (items && items.length > 0) {
      if (items.length <= 5) {
        transactionItems = items.map((item: { name: string; quantity: number; price: number }) => ({
          title: item.name,
          quantity: item.quantity,
          unitPrice: Math.round(item.price * 100),
          tangible: true,
        }));
      } else {
        const totalQty = items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0);
        transactionItems = [{
          title: `Pedido com ${totalQty} itens`,
          quantity: 1,
          unitPrice: Math.round(amount * 100),
          tangible: true,
        }];
      }
    } else {
      transactionItems = [{ title: description || "Pedido", quantity: 1, unitPrice: Math.round(amount * 100), tangible: true }];
    }

    const body = {
      paymentMethod: "pix",
      amount: Math.round(amount * 100),
      items: transactionItems,
      customer: {
        name: customer?.name || "Cliente",
        email: customer?.email || "cliente@email.com",
        phone: customer?.phone || "11999999999",
        document: {
          number: customer?.document || "00000000000",
          type: (customer?.document?.length === 14) ? "cnpj" : "cpf",
        },
      },
    };

    console.log("MedusaPay request:", JSON.stringify(body));

    const response = await fetch("https://api.v2.medusapay.com.br/v1/transactions", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 300));
      throw new Error(`MedusaPay returned non-JSON (${response.status})`);
    }

    const data = await response.json();

    if (!response.ok) {
      console.error("MedusaPay error:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: data }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("MedusaPay success:", JSON.stringify(data));

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
