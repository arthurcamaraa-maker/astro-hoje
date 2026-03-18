const ARCANOS = [
  { id: 'o-louco',         nome: 'O Louco',          numero: 0,  simbolo: '🌟', energia: 'início, liberdade, salto de fé' },
  { id: 'o-mago',          nome: 'O Mago',            numero: 1,  simbolo: '✦',  energia: 'vontade, habilidade, manifestação' },
  { id: 'a-sacerdotisa',   nome: 'A Sacerdotisa',     numero: 2,  simbolo: '🌙', energia: 'intuição, mistério, sabedoria interior' },
  { id: 'a-imperatriz',    nome: 'A Imperatriz',      numero: 3,  simbolo: '🌿', energia: 'abundância, criatividade, fertilidade' },
  { id: 'o-imperador',     nome: 'O Imperador',       numero: 4,  simbolo: '♦',  energia: 'estrutura, autoridade, estabilidade' },
  { id: 'o-hierofante',    nome: 'O Hierofante',      numero: 5,  simbolo: '☽',  energia: 'tradição, orientação, espiritualidade' },
  { id: 'os-amantes',      nome: 'Os Amantes',        numero: 6,  simbolo: '♡',  energia: 'escolhas, amor, alinhamento' },
  { id: 'o-carro',         nome: 'O Carro',           numero: 7,  simbolo: '⚡', energia: 'determinação, controle, vitória' },
  { id: 'a-forca',         nome: 'A Força',           numero: 8,  simbolo: '∞',  energia: 'coragem interior, paciência, compaixão' },
  { id: 'o-eremita',       nome: 'O Eremita',         numero: 9,  simbolo: '🕯', energia: 'introspecção, busca interior, sabedoria' },
  { id: 'a-roda',          nome: 'A Roda da Fortuna', numero: 10, simbolo: '☸',  energia: 'ciclos, destino, mudança' },
  { id: 'a-justica',       nome: 'A Justiça',         numero: 11, simbolo: '⚖', energia: 'equilíbrio, verdade, karma' },
  { id: 'o-enforcado',     nome: 'O Enforcado',       numero: 12, simbolo: '💧', energia: 'pausa, rendição, nova perspectiva' },
  { id: 'a-morte',         nome: 'A Transformação',   numero: 13, simbolo: '🦋', energia: 'transformação, encerramento, renascimento' },
  { id: 'a-temperanca',    nome: 'A Temperança',      numero: 14, simbolo: '✧',  energia: 'equilíbrio, paciência, propósito' },
  { id: 'o-diabo',         nome: 'A Libertação',      numero: 15, simbolo: '🔓', energia: 'libertação, consciência, quebrar padrões' },
  { id: 'a-torre',         nome: 'A Renovação',       numero: 16, simbolo: '🌊', energia: 'revelação, renovação, clareza repentina' },
  { id: 'a-estrela',       nome: 'A Estrela',         numero: 17, simbolo: '⭐', energia: 'esperança, inspiração, cura' },
  { id: 'a-lua',           nome: 'A Lua',             numero: 18, simbolo: '🌕', energia: 'intuição profunda, sonhos, o inconsciente' },
  { id: 'o-sol',           nome: 'O Sol',             numero: 19, simbolo: '☀', energia: 'alegria, vitalidade, clareza' },
  { id: 'o-julgamento',    nome: 'O Julgamento',      numero: 20, simbolo: '🎺', energia: 'chamado, renovação, despertar' },
  { id: 'o-mundo',         nome: 'O Mundo',           numero: 21, simbolo: '🌍', energia: 'completude, integração, conquista' },
];

// Sorteia 3 cartas únicas
function sortearCartas() {
  const embaralhado = [...ARCANOS].sort(() => Math.random() - 0.5);
  return embaralhado.slice(0, 3);
}

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { signo, humor, aniversario, genero } = req.body;
  if (!signo || !humor) {
    return res.status(400).json({ error: 'Signo e humor são obrigatórios' });
  }

  const cartas = sortearCartas();
  const [passado, presente, futuro] = cartas;

  // Perguntas âncora personalizadas pelo humor
  const ancoras = {
    'triste':     { passado: 'o que te fortaleceu até aqui',    presente: 'onde repousa sua força agora',       futuro: 'o que vai se acomodar e trazer paz' },
    'feliz':      { passado: 'o que você cultivou para chegar aqui', presente: 'como aproveitar esse florescer', futuro: 'para onde essa alegria te leva' },
    'ansiosa':    { passado: 'o que você já superou antes',     presente: 'o que pede sua atenção agora',       futuro: 'o que vai se acomodar' },
    'animada':    { passado: 'o que te trouxe até esse momento', presente: 'a energia que você carrega agora',  futuro: 'o que está sendo criado' },
    'nervosa':    { passado: 'onde você encontrou equilíbrio antes', presente: 'o que pede leveza agora',       futuro: 'onde a calma te espera' },
    'apaixonada': { passado: 'o que abriu seu coração',         presente: 'o que esse amor revela em você',    futuro: 'para onde essa energia te leva' },
  };

  const ancora = ancoras[humor] || { passado: 'o que te trouxe até aqui', presente: 'onde você está agora', futuro: 'o que está chegando' };

  const prompt = `Você é uma tarologa amorosa, sábia e poética. Faça uma tiragem de 3 cartas do tarô para uma pessoa de ${signo} que está se sentindo ${humor} hoje.

As cartas sorteadas são:
- PASSADO (${ancora.passado}): ${passado.nome} — energia: ${passado.energia}
- PRESENTE (${ancora.presente}): ${presente.nome} — energia: ${presente.energia}
- FUTURO (${ancora.futuro}): ${futuro.nome} — energia: ${futuro.energia}

GÊNERO DA PESSOA: ${
    genero === 'masculino'   ? 'Use concordância masculina. Ex: "você está pronto", "seja corajoso".' :
    genero === 'nao-binario' ? 'Use linguagem completamente neutra — NUNCA use adjetivos com marcação de gênero (-o/-a). Reescreva as frases com substantivos, verbos e construções universais. Ex: em vez de "pronta/pronto" use "sua energia está em expansão"; em vez de "corajosa/corajoso" use "confiante na sua força". O texto deve soar natural e poético, sem que se perceba a adaptação.' :
    'Use concordância feminina. Ex: "você está pronta", "seja corajosa".'
  }

REGRAS ABSOLUTAS:
- Tom SEMPRE positivo, acolhedor, inspirador e empoderador
- Cartas "difíceis" têm sempre uma interpretação construtiva e positiva
- JAMAIS mencione aspectos negativos, medo, perda ou dificuldade
- Cada interpretação deve soar como uma conversa íntima com a pessoa

Retorne SOMENTE um JSON válido, sem markdown, sem texto fora do JSON:
{
  "passado": {
    "interpretacao": "2-3 frases poéticas e tocantes interpretando ${passado.nome} no contexto de ${ancora.passado} para alguém de ${signo} que está ${humor}"
  },
  "presente": {
    "interpretacao": "2-3 frases poéticas e tocantes interpretando ${presente.nome} no contexto de ${ancora.presente}"
  },
  "futuro": {
    "interpretacao": "2-3 frases poéticas e tocantes interpretando ${futuro.nome} no contexto de ${ancora.futuro}"
  },
  "narrativa": "Um parágrafo final de 3-4 frases que une as 3 cartas numa história contínua e inspiradora sobre o momento desta pessoa. Deve soar como uma mensagem especial do universo."
}`;

  try {
    const https = require('https');

    const payload = JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.9,
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
          try { resolve({ status: response.statusCode, body: JSON.parse(data) }); }
          catch (e) { reject(new Error('Falha ao parsear resposta')); }
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
    const leituras = JSON.parse(clean);

    return res.status(200).json({
      cartas: {
        passado:  { ...passado,  ...leituras.passado  },
        presente: { ...presente, ...leituras.presente },
        futuro:   { ...futuro,   ...leituras.futuro   },
      },
      narrativa: leituras.narrativa,
    });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
};

module.exports = handler;
