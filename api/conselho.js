const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { signo, aniversario, humor } = req.body;

  if (!signo || !humor) {
    return res.status(400).json({ error: 'Signo e humor são obrigatórios' });
  }

  const signTraits = {
    'Áries':       'corajoso, pioneiro, energético, impulsivo, líder natural',
    'Touro':       'estável, sensual, persistente, amante do conforto e da beleza',
    'Gêmeos':      'curioso, comunicativo, versátil, inteligente, sociável',
    'Câncer':      'intuitivo, amoroso, protetor, sensível, familiado',
    'Leão':        'confiante, criativo, generoso, carismático, apaixonado',
    'Virgem':      'analítico, dedicado, cuidadoso, prático, perfeccionista',
    'Libra':       'harmonioso, justo, diplomático, romântico, refinado',
    'Escorpião':   'intenso, transformador, perspicaz, leal, profundo',
    'Sagitário':   'aventureiro, otimista, filosófico, livre, expansivo',
    'Capricórnio': 'ambicioso, disciplinado, responsável, determinado, confiável',
    'Aquário':     'inovador, humanitário, original, independente, visionário',
    'Peixes':      'empático, criativo, espiritual, sonhador, compassivo',
  };

  const humorGuide = {
    'triste':     'A pessoa está triste. Use tom reconfortante, acolhedor e encorajador. Ofereça um conselho que eleve a autoestima e traga leveza. O filme e a música devem ser alegres e reconfortantes, não tristes.',
    'feliz':      'A pessoa está feliz! Celebre essa energia com um conselho que amplifique a alegria e o florescimento. Filme e música devem combinar com essa vibração positiva.',
    'ansiosa':    'A pessoa está ansiosa. Ofereça calma, serenidade e perspectiva tranquilizadora. Evite qualquer pressão. Filme e música devem ser tranquilizantes e reconfortantes.',
    'animada':    'A pessoa está animada e cheia de energia! Canalize essa empolgação com um conselho que inspire ação positiva e grandes sonhos. Filme e música devem ser empolgantes.',
    'nervosa':    'A pessoa está nervosa. Ofereça leveza, respiração e redirecionamento gentil da energia. Filme e música devem ter energia positiva e leve.',
    'apaixonada': 'A pessoa está apaixonada! Celebre o amor e a conexão com um conselho romântico e bonito. Filme e música devem ser românticos e encantadores.',
  };

  const birthdayNote = aniversario
    ? `A data de aniversário é ${aniversario}. Use isso sutilmente para personalizar, mas sem cálculos astrológicos complexos.`
    : '';

  const prompt = `Você é uma astrologa amorosa, sábia e inspiradora que cria mensagens do dia para pessoas com base em seu signo e humor.

SIGNO: ${signo}
Traços do signo: ${signTraits[signo] || 'cheio de qualidades únicas'}
HUMOR DO DIA: ${humor}
${birthdayNote}

REGRA DE TOM: ${humorGuide[humor] || ''}

REGRAS ABSOLUTAS:
- Tom SEMPRE positivo, acolhedor, leve, inspirador e agradável
- JAMAIS mencione: ódio, morte, acidente, traição, rivalidade, perda, dor ou qualquer coisa negativa
- O resultado deve soar como um abraço caloroso

Retorne SOMENTE um JSON válido, sem markdown, sem texto fora do JSON, com exatamente esta estrutura:
{
  "conselho": "Um conselho do dia rico, pessoal e inspirador com 2-3 frases. Combine obrigatoriamente as características do signo com o estado emocional. Seja específico e tocante.",
  "frase": "Uma frase bonita e poética baseada no conselho. Deve ser memorável, como uma citação que a pessoa vai querer guardar. Máximo 2 frases.",
  "numeros": [n1, n2, n3, n4, n5, n6],
  "filme": {
    "titulo": "Nome do filme",
    "motivo": "Uma frase curta e encantadora explicando por que este filme combina com a energia do dia"
  },
  "musica": {
    "titulo": "Nome da música - Artista",
    "motivo": "Uma frase curta e encantadora explicando por que esta música combina com o momento"
  }
}

Os 6 números da sorte devem ser únicos, entre 1 e 99.
O filme deve ser famoso e amplamente conhecido.
A música deve ser famosa e amplamente conhecida.
Ambos devem combinar com a energia de ${signo} + ${humor} — se o humor for triste, escolha filme e música alegres.`;

  try {
    const https = require('https');

    const payload = JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.85,
    });

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
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
            reject(new Error('Falha ao parsear resposta da OpenAI'));
          }
        });
      });

      request.on('error', reject);
      request.write(payload);
      request.end();
    });

    if (result.status !== 200) {
      console.error('OpenAI error:', result.body);
      return res.status(500).json({ error: 'Erro ao consultar a IA' });
    }

    const text = result.body.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
};

module.exports = handler;
