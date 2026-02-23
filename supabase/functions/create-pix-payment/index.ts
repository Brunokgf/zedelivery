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
    const { amount, description, customer } = await req.json();

    const secretKey = Deno.env.get("MEDUSAPAY_SECRET_KEY");
    if (!secretKey) {
      throw new Error("MEDUSAPAY_SECRET_KEY not configured");
    }

    const auth = btoa(`${secretKey}:x`);

    const response = await fetch("https://api.v2.medusapay.com.br/v1/transactions", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // centavos
        payment_method: "pix",
        description: description || "Pedido Ze Delivery",
        customer: customer || {},
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("MedusaPay error:", data);
      return new Response(JSON.stringify({ error: data }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
