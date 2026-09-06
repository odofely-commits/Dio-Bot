const axios = require('axios');
const config = require('../config');

const acciones = {
  hug: {
    emoji: '٩(๑❛ᴗ❛๑)۶',
    verbo: '*abraza*',
    descripcion: 'Abrazo'
  },
  kiss: {
    emoji: '💋',
    verbo: '*besa*',
    descripcion: 'Beso'
  },
  pat: {
    emoji: '(´∀｀)♡',
    verbo: '*acaricia*',
    descripcion: 'Acaricia'
  },
  slap: {
    emoji: '👋',
    verbo: '*bofetea*',
    descripcion: 'Bofetada'
  },
  bite: {
    emoji: '(╯3╰)',
    verbo: '*muerde*',
    descripcion: 'Muerde'
  },
  lick: {
    emoji: '(≧◡≦)',
    verbo: '*lame*',
    descripcion: 'Lame'
  },
  cuddle: {
    emoji: '(⸝⸝ᵕᴗᵕ⸝⸝)',
    verbo: '*abraza fuerte*',
    descripcion: 'Abrazo fuerte'
  },
  poke: {
    emoji: '👆',
    verbo: '*pica*',
    descripcion: 'Pica'
  },
  tickle: {
    emoji: '(๑•́ㅁ•́๑)✧',
    verbo: '*cosquillas*',
    descripcion: 'Cosquillas'
  },
  punch: {
    emoji: '👊',
    verbo: '*puñetazo*',
    descripcion: 'Puñetazo'
  }
};

async function handleAction(sock, from, action, args, msg) {
  try {
    if (!acciones[action]) {
      await sock.sendMessage(from, {
        text: `${config.styles.colors.error} Acción no válida.`
      });
      return;
    }

    const actionData = acciones[action];
    const mention = args[0] ? `@${args[0]}` : 'alguien';
    
    const mensaje = `${config.styles.colors.main} ${actionData.emoji} ${actionData.verbo} a ${mention} ${config.styles.colors.main}`;

    await sock.sendMessage(from, { text: mensaje });

  } catch (error) {
    console.error(`${config.styles.colors.error} Error:`, error);
  }
}

async function sendActionImage(sock, from, action) {
  try {
    if (!acciones[action]) {
      await sock.sendMessage(from, {
        text: `${config.styles.colors.error} Acción no válida.`
      });
      return;
    }

    const actionMap = {
      hug: 'hug',
      kiss: 'kiss',
      pat: 'pat',
      slap: 'slap',
      bite: 'bite',
      lick: 'lick',
      cuddle: 'cuddle',
      poke: 'poke',
      tickle: 'tickle',
      punch: 'slap'
    };

    const imageType = actionMap[action] || action;
    
    try {
      const response = await axios.get(`${config.nekosApi}/img/${imageType}`);
      const imageUrl = response.data.url;
      const actionData = acciones[action];

      await sock.sendMessage(from, {
        image: { url: imageUrl },
        caption: `${config.styles.colors.main} ${actionData.emoji} ${actionData.descripcion} ${config.styles.colors.main}`
      });
    } catch (err) {
      // Si falla la API, enviar solo el texto
      await handleAction(sock, from, action, [], null);
    }

  } catch (error) {
    console.error('Error en acción:', error);
  }
}

module.exports = { handleAction, sendActionImage, acciones };
