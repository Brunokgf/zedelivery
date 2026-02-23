import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderPayload {
  items: OrderItem[];
  address: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
  };
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: OrderPayload = await req.json();
    const { items, address, paymentMethod, subtotal, deliveryFee, total } = payload;

    const itemsHtml = items.map(item =>
      `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${item.quantity}x ${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</td>
      </tr>`
    ).join('');

    const paymentLabels: Record<string, string> = {
      pix: 'PIX',
      credit: 'Cartão de Crédito',
      debit: 'Cartão de Débito',
      cash: 'Dinheiro',
    };

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#f59e0b;text-align:center;">🍺 Novo Pedido Recebido!</h1>
        
        <h2 style="color:#333;">📍 Endereço de Entrega</h2>
        <p style="color:#555;">
          ${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ''}<br/>
          ${address.neighborhood} - ${address.city}<br/>
          ${address.cep ? `CEP: ${address.cep}` : ''}
        </p>

        <h2 style="color:#333;">💳 Pagamento</h2>
        <p style="color:#555;">${paymentLabels[paymentMethod] || paymentMethod}</p>

        <h2 style="color:#333;">📦 Itens do Pedido</h2>
        <table style="width:100%;border-collapse:collapse;">
          ${itemsHtml}
        </table>

        <div style="margin-top:16px;padding:12px;background:#f9f9f9;border-radius:8px;">
          <p style="margin:4px 0;color:#555;">Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}</p>
          <p style="margin:4px 0;color:#555;">Taxa de entrega: R$ ${deliveryFee.toFixed(2).replace('.', ',')}</p>
          <p style="margin:4px 0;font-size:18px;font-weight:bold;color:#16a34a;">Total: R$ ${total.toFixed(2).replace('.', ',')}</p>
        </div>
      </div>
    `;

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    // Send email using Resend
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Pedido <onboarding@resend.dev>',
        to: ['rubenscardosoaguiar@gmail.com'],
        subject: `Novo Pedido - R$ ${total.toFixed(2).replace('.', ',')}`,
        html,
      }),
    });

    const emailData = await emailRes.json();

    if (!emailRes.ok) {
      console.error('Resend error:', emailData);
      return new Response(JSON.stringify({ error: 'Failed to send email', details: emailData }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, id: emailData.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
