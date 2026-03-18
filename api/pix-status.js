const https = require('https');

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { payment_id } = req.query;
  if (!payment_id) {
    return res.status(400).json({ error: 'payment_id é obrigatório' });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.mercadopago.com',
        path: `/v1/payments/${payment_id}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
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
      request.end();
    });

    if (result.status !== 200) {
      console.error('MP status error:', result.body);
      return res.status(500).json({ error: 'Erro ao consultar pagamento' });
    }

    const payment = result.body;

    return res.status(200).json({
      status: payment.status, // pending | approved | rejected | cancelled
      approved: payment.status === 'approved',
    });

  } catch (err) {
    console.error('Pix status error:', err);
    return res.status(500).json({ error: 'Erro interno.' });
  }
};

module.exports = handler;
