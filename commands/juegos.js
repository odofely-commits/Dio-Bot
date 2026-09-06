const config = require('../config');

// Datos de juegos (en producción usar base de datos)
const triviaQuestions = [
  { question: '¿Cuál es la capital de Japón?', options: ['Tokio', 'Osaka', 'Kyoto'], answer: 'Tokio' },
  { question: '¿Cuál es el anime más popular de todos los tiempos?', options: ['Naruto', 'One Piece', 'Death Note'], answer: 'One Piece' },
  { question: '¿En qué año se estrenó Dragon Ball?', options: ['1986', '1989', '1991'], answer: '1986' },
  { question: '¿Cuál es el manga más vendido?', options: ['One Piece', 'Naruto', 'My Hero Academia'], answer: 'One Piece' },
  { question: '¿Quién es el creador de Naruto?', options: ['Masashi Kishimoto', 'Eiichiro Oda', 'Kohei Horikoshi'], answer: 'Masashi Kishimoto' }
];

const truthQuestions = [
  '¿Cuál es tu mayor miedo?',
  '¿Cuántas veces te has enamorado?',
  '¿Cuál es tu secreto más grande?',
  '¿Qué harías si tuvieras un millón de dólares?',
  '¿Cuál es la cosa más vergonzosa que has hecho?',
  '¿Qué es lo que más te gusta de ti?',
  '¿Cuál es tu fantasía más loca?'
];

const dareQuestions = [
  'Haz 20 flexiones en este momento',
  'Canta una canción completa en este chat',
  'Salta en un pie durante 1 minuto',
  'Imita a tu personaje anime favorito',
  'Di algo bonito a alguien en el grupo',
  'Envía una foto tuya con cara de tonto',
  'Baila frente al espejo durante 5 minutos'
];

async function playTrivia(sock, from) {
  try {
    const question = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
    
    const optionsText = question.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n');
    
    const message = `
${config.styles.colors.main} ${config.styles.prefix} TRIVIA ${config.styles.prefix}

📚 ${question.question}

${optionsText}

${config.styles.colors.secondary} Responde con: #respuesta 1/2/3
${config.styles.colors.main}`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error en trivia:', error);
  }
}

async function playTruthOrDare(sock, from, type) {
  try {
    let question, emoji, title;
    
    if (type === 'truth') {
      question = truthQuestions[Math.floor(Math.random() * truthQuestions.length)];
      emoji = '❓';
      title = 'VERDAD';
    } else if (type === 'dare') {
      question = dareQuestions[Math.floor(Math.random() * dareQuestions.length)];
      emoji = '🎯';
      title = 'RETO';
    }

    const message = `
${config.styles.colors.main} ${config.styles.prefix} ${title} ${config.styles.prefix}

${emoji} ${question}

${config.styles.colors.secondary} ¿Aceptas el reto?
${config.styles.colors.main}`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error en truth/dare:', error);
  }
}

async function playEightBall(sock, from) {
  try {
    const responses = [
      '✨ Definitivamente sí',
      '✨ Probablemente',
      '✨ Tal vez',
      '✨ Sin dudas',
      '✨ Muy probable',
      '✨ No parece probable',
      '✨ Definitivamente no',
      '✨ No cuentes con ello',
      '✨ Los signos apuntan a que sí',
      '✨ Pregunta más tarde'
    ];

    const answer = responses[Math.floor(Math.random() * responses.length)];
    
    const message = `
${config.styles.colors.main} ${config.styles.prefix} BOLA MÁGICA ${config.styles.prefix}

🔮 ${answer}

${config.styles.colors.secondary} Prueba de nuevo: #8ball
${config.styles.colors.main}`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error en 8ball:', error);
  }
}

async function playCoinFlip(sock, from) {
  try {
    const result = Math.random() > 0.5 ? 'Cara' : 'Sello';
    const emoji = result === 'Cara' ? '🪙' : '🪙';

    const message = `
${config.styles.colors.main} ${config.styles.prefix} VOLADO ${config.styles.prefix}

${emoji} ${result}

${config.styles.colors.secondary} Prueba de nuevo: #volado
${config.styles.colors.main}`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error en coinflip:', error);
  }
}

async function playChoose(sock, from, args) {
  try {
    if (args.length < 2) {
      await sock.sendMessage(from, {
        text: `${config.styles.colors.error} Uso: #elige opción1 opción2 [opción3...]`
      });
      return;
    }

    const chosen = args[Math.floor(Math.random() * args.length)];

    const message = `
${config.styles.colors.main} ${config.styles.prefix} ELEGILDO ${config.styles.prefix}

🎲 ${chosen}

${config.styles.colors.secondary} Prueba de nuevo: #elige
${config.styles.colors.main}`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error en choose:', error);
  }
}

module.exports = { playTrivia, playTruthOrDare, playEightBall, playCoinFlip, playChoose };
