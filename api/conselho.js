const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { signo, aniversario, humor, genero } = req.body;

  if (!signo || !humor) {
    return res.status(400).json({ error: 'Signo e humor são obrigatórios' });
  }

  // ── Gênero ──
  const generoGuide = {
    'feminino':    'Use concordância gramatical feminina em todo o texto. Ex: "você está pronta", "você é capaz", "seja corajosa". Tom acolhedor e empoderador para mulheres.',
    'masculino':   'Use concordância gramatical masculina em todo o texto. Ex: "você está pronto", "você é capaz", "seja corajoso". Tom direto e encorajador para homens.',
    'nao-binario': 'Use linguagem completamente neutra — NUNCA use adjetivos com marcação de gênero (-o/-a). Reescreva as frases para usar substantivos, verbos e construções universais que funcionam para qualquer pessoa. Ex: em vez de "você está pronta/pronto" use "sua energia está em expansão"; em vez de "seja corajosa/corajoso" use "confie na sua força"; em vez de "você é linda/lindo" use "sua presença é luminosa". O texto deve soar natural e poético, sem que se perceba a adaptação. Tom profundamente acolhedor, livre e celebratório.',
  };
  const generoInstrucao = generoGuide[genero] || generoGuide['feminino'];

  // ── Bloco 1: Era aleatória ──
  const eras = [
    'anos 80',
    'anos 90',
    'anos 2000',
    'anos 2010',
    'lançamento recente (2020 em diante)',
  ];
  const era = eras[Math.floor(Math.random() * eras.length)];

  // ── Bloco 2: Formato do conselho sorteado ──
  const formatos = [
    'metáfora poética — use uma imagem bonita da natureza ou do cosmos para abrir o conselho',
    'afirmação direta e poderosa — frases curtas, confiantes, que empoderam sem rodeios',
    'pergunta reflexiva seguida de resposta acolhedora — convide a pessoa a olhar para dentro',
    'imagem sensorial — descreva a energia do dia como se fosse uma cena, uma luz, uma textura',
  ];
  const formato = formatos[Math.floor(Math.random() * formatos.length)];

  // ── Bloco 2: Traços expandidos por signo ──
  const signData = {
    'Áries':       { tracos: 'corajoso, pioneiro, energético, impulsivo, líder natural', planeta: 'Marte', elemento: 'Fogo', tema: 'identidade, ação, começos', sombra: 'impaciência, agir sem pensar' },
    'Touro':       { tracos: 'estável, sensual, persistente, leal, amante do conforto', planeta: 'Vênus', elemento: 'Terra', tema: 'prazer, segurança, valores', sombra: 'teimosia, apego ao material' },
    'Gêmeos':      { tracos: 'curioso, comunicativo, versátil, inteligente, sociável', planeta: 'Mercúrio', elemento: 'Ar', tema: 'conexão, aprendizado, troca', sombra: 'dispersão, superficialidade' },
    'Câncer':      { tracos: 'intuitivo, amoroso, protetor, sensível, nutrido pelo lar', planeta: 'Lua', elemento: 'Água', tema: 'família, memória, cuidado', sombra: 'apego emocional, medo de abandono' },
    'Leão':        { tracos: 'confiante, criativo, generoso, carismático, apaixonado', planeta: 'Sol', elemento: 'Fogo', tema: 'expressão, brilho, identidade', sombra: 'vaidade, necessidade de validação' },
    'Virgem':      { tracos: 'analítico, dedicado, cuidadoso, prático, perfeccionista', planeta: 'Mercúrio', elemento: 'Terra', tema: 'serviço, melhoria, saúde', sombra: 'autocrítica excessiva, perfeccionismo' },
    'Libra':       { tracos: 'harmonioso, justo, diplomático, romântico, refinado', planeta: 'Vênus', elemento: 'Ar', tema: 'relacionamentos, equilíbrio, beleza', sombra: 'indecisão, evitar conflitos' },
    'Escorpião':   { tracos: 'intenso, transformador, perspicaz, leal, profundo', planeta: 'Plutão', elemento: 'Água', tema: 'transformação, poder, mistério', sombra: 'ciúme, controle, obsessão' },
    'Sagitário':   { tracos: 'aventureiro, otimista, filosófico, livre, expansivo', planeta: 'Júpiter', elemento: 'Fogo', tema: 'liberdade, sabedoria, expansão', sombra: 'excesso, irresponsabilidade' },
    'Capricórnio': { tracos: 'ambicioso, disciplinado, responsável, determinado, confiável', planeta: 'Saturno', elemento: 'Terra', tema: 'conquista, estrutura, legado', sombra: 'rigidez, workaholism' },
    'Aquário':     { tracos: 'inovador, humanitário, original, independente, visionário', planeta: 'Urano', elemento: 'Ar', tema: 'coletivo, revolução, originalidade', sombra: 'frieza emocional, distanciamento' },
    'Peixes':      { tracos: 'empático, criativo, espiritual, sonhador, compassivo', planeta: 'Netuno', elemento: 'Água', tema: 'espiritualidade, sonhos, dissolução', sombra: 'escapismo, dificuldade de limites' },
  };

  const sign = signData[signo] || { tracos: 'único e especial', planeta: '—', elemento: '—', tema: '—', sombra: '—' };

  const humorGuide = {
    'triste':     'A pessoa está triste. Use tom reconfortante, acolhedor e encorajador. Ofereça um conselho que eleve a autoestima e traga leveza. O filme e a música devem ser alegres e reconfortantes, não tristes.',
    'feliz':      'A pessoa está feliz! Celebre essa energia com um conselho que amplifique a alegria e o florescimento. Filme e música devem combinar com essa vibração positiva.',
    'ansiosa':    'A pessoa está ansiosa. Ofereça calma, serenidade e perspectiva tranquilizadora. Evite qualquer pressão. Filme e música devem ser tranquilizantes e reconfortantes.',
    'animada':    'A pessoa está animada e cheia de energia! Canalize essa empolgação com um conselho que inspire ação positiva e grandes sonhos. Filme e música devem ser empolgantes.',
    'nervosa':    'A pessoa está nervosa. Ofereça leveza, respiração e redirecionamento gentil da energia. Filme e música devem ter energia positiva e leve.',
    'apaixonada': 'A pessoa está apaixonada! Celebre o amor e a conexão com um conselho romântico e bonito. Filme e música devem ser românticos e encantadores.',
  };

  // ── Bloco 3: Personalização pelo aniversário ──
  let birthdayNote = '';
  if (aniversario) {
    const parts = aniversario.split('/');
    const dia = parseInt(parts[0]);
    const mes = parseInt(parts[1]);
    const ano = parseInt(parts[2]);

    // Número pessoal — soma de todos os dígitos da data reduzida a 1 dígito
    const somaDigitos = (n) => {
      let s = String(n).split('').reduce((a, d) => a + parseInt(d), 0);
      while (s > 9) s = String(s).split('').reduce((a, d) => a + parseInt(d), 0);
      return s;
    };
    const numeroPessoal = somaDigitos(dia + mes + ano);

    // Proximidade do aniversário — verifica se está nos próximos 7 dias
    const hoje = new Date();
    const proxAniv = new Date(hoje.getFullYear(), mes - 1, dia);
    if (proxAniv < hoje) proxAniv.setFullYear(hoje.getFullYear() + 1);
    const diasAteAniv = Math.ceil((proxAniv - hoje) / (1000 * 60 * 60 * 24));
    const anivProximo = diasAteAniv <= 7;

    birthdayNote = `
Dados do aniversário (${aniversario}):
- Número pessoal: ${numeroPessoal} — use este número sutilmente para enriquecer o conselho (ex: número ${numeroPessoal} ressoa com... ou a vibração do ${numeroPessoal}...).
${anivProximo ? `- ATENÇÃO: o aniversário desta pessoa é em ${diasAteAniv === 0 ? 'hoje!' : `${diasAteAniv} dia(s)!`} Inclua uma menção acolhedora e celebratória a isso no conselho — algo especial e caloroso.` : ''}
    `.trim();
  }

  const prompt = `Você é uma astróloga amorosa, sábia e inspiradora que cria mensagens do dia para pessoas com base em seu signo e humor.

SIGNO: ${signo}
Traços: ${sign.tracos}
Planeta regente: ${sign.planeta}
Elemento: ${sign.elemento}
Tema de vida: ${sign.tema}
Sombra do signo (use com leveza, sem focar no negativo): ${sign.sombra}
HUMOR DO DIA: ${humor}
${birthdayNote}

REGRA DE TOM: ${humorGuide[humor] || ''}

GÊNERO DA PESSOA: ${generoInstrucao}

REGRAS ABSOLUTAS:
- Tom SEMPRE positivo, acolhedor, leve, inspirador e agradável
- JAMAIS mencione: ódio, morte, acidente, traição, rivalidade, perda, dor ou qualquer coisa negativa
- O resultado deve soar como um abraço caloroso

FORMATO DO CONSELHO — use obrigatoriamente este estilo hoje:
${formato}

INSTRUÇÕES PARA FILME E MÚSICA:
Antes de escolher o filme e a música, defina internamente (não inclua no JSON) uma palavra que represente a energia central do dia para ${signo} + ${humor}. Exemplos: esplendor, quietude, foco, leveza, encantamento, ousadia, acolhimento, expansão, brilho, ternura, impulso, fluidez.
Use essa palavra como bússola para escolher obras que incarnem essa energia — não o óbvio e previsível para o signo.

ERA OBRIGATÓRIA: o filme e a música devem ser da seguinte época: ${era}.
Explore gêneros variados: pop, rock, soul, MPB, eletrônico, clássico, hip-hop, jazz, bossa nova, samba, funk, indie, R&B, world music.
Inclua artistas brasileiros e internacionais — varie entre os dois.
Escolha obras amplamente conhecidas e fáceis de encontrar no streaming.

REGRAS PARA O CONSELHO — muito importante:
- Mencione o signo pelo nome em algum momento
- Conecte o planeta regente (${sign.planeta}) ou o elemento (${sign.elemento}) diretamente ao estado emocional (${humor}) de forma poética e surpreendente
- Evite frases genéricas e vazias como "confie em si mesmo", "o universo está ao seu lado", "você é capaz" — essas frases não dizem nada específico
- A pessoa deve sentir que o conselho foi escrito exclusivamente para ela
- Termine com uma orientação concreta e sensorial para o dia — algo que ela possa realmente fazer ou sentir

Retorne SOMENTE um JSON válido, sem markdown, sem texto fora do JSON, com exatamente esta estrutura:
{
  "conselho": "Conselho no formato sorteado acima. 3-4 frases ricas, personalizadas e profundas. Use o signo, o planeta ${sign.planeta}, o elemento ${sign.elemento} e o humor ${humor} de forma específica e poética. Surpreenda — não escreva o óbvio.",
  "frase": "Uma frase curta, original e memorável que capture a essência do conselho. Deve soar como algo que a pessoa vai querer salvar. Máximo 1 frase.",
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

Os 6 números da sorte devem ser únicos, entre 1 e 99.`;

  try {
    const https = require('https');

    const payload = JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.95,
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
