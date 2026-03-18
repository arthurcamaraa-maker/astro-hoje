const https = require('https');

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { payment_id_ref } = req.body;
  if (!payment_id_ref) {
    return res.status(400).json({ error: 'payment_id_ref é obrigatório' });
  }

  const payload = JSON.stringify({
    transaction_amount: 1.99,
    description: 'Leitura de Tarô — Astro Hoje',
    payment_method_id: 'pix',
    payer: {
      email: 'cliente@astrohoje.com',
    },
    external_reference: payment_id_ref,
  });

  try {
    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.mercadopago.com',
        path: '/v1/payments',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'X-Idempotency-Key': payment_id_ref,
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
          try {
            resolve({ status: response.statusCode, body: JSON.parse(data) });
          } catch (e) {
            reject(new Error('Falha ao parsear resposta do Mercado Pago'));
          }
        });
      });

      request.on('error', reject);
      request.write(payload);
      request.end();
    });

    if (result.status !== 201) {
      console.error('MP error:', result.body);
      return res.status(500).json({ error: 'Erro ao criar cobrança Pix' });
    }

    const payment = result.body;
    const qr = payment.point_of_interaction?.transaction_data;

    return res.status(200).json({
      payment_id: payment.id,
      qr_code: qr?.qr_code,
      qr_code_base64: qr?.qr_code_base64,
    });

  } catch (err) {
    console.error('Pix handler error:', err);
    return res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
};

module.exports = handler;
