const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, MessageType, Boom } = require('baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const config = require('./config');

let sock;
let isConnected = false;

// Crear directorio de sesión si no existe
const authDir = './sessions';
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

// Inicializar bot
async function initializeBot() {
  const { state, saveCreds } = await useMultiFileAuthState(authDir);

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  // Evento: QR generado
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n≽^•ˑ•ྀི≼ ESCANEA ESTE QR CON WHATSAPP ≽^•ˑ•ྀི≼\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'connecting') {
      console.log(`${config.styles.colors.main} Conectando...`);
    }

    if (connection === 'open') {
      isConnected = true;
      console.log(`\n${config.styles.colors.success} ¡Bot conectado exitosamente!`);
      console.log(`${config.styles.colors.main} ${config.styles.greeting}\n`);
    }

    if (connection === 'close') {
      isConnected = false;
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log(`${config.styles.colors.error} Sesión cerrada. Escanea el QR de nuevo.`);
        process.exit();
      } else {
        console.log(`${config.styles.colors.error} Conexión perdida. Reconectando...`);
        setTimeout(initializeBot, 3000);
      }
    }
  });

  // Guardar credenciales
  sock.ev.on('creds.update', saveCreds);

  // Procesar mensajes
  sock.ev.on('messages.upsert', async (message) => {
    try {
      const msg = message.messages[0];
      if (!msg.message) return;

      const from = msg.key.remoteJid;
      const messageType = Object.keys(msg.message)[0];
      let messageText = '';

      if (messageType === 'conversation') {
        messageText = msg.message.conversation;
      } else if (messageType === 'extendedTextMessage') {
        messageText = msg.message.extendedTextMessage.text;
      }

      // Verificar si es un comando
      if (!messageText.startsWith(config.prefix)) return;

      const commandName = messageText.slice(config.prefix.length).split(' ')[0].toLowerCase();
      const args = messageText.slice(config.prefix.length).split(' ').slice(1);

      console.log(`${config.styles.colors.main} Comando recibido: ${commandName}`);

      // Procesar comando
      await handleCommand(sock, from, commandName, args, msg);

    } catch (error) {
      console.error(`${config.styles.colors.error} Error procesando mensaje:`, error);
    }
  });
}

// Manejar comandos
async function handleCommand(sock, from, command, args, msg) {
  try {
    switch (command) {
      case 'help':
      case 'menu':
        await sendMenu(sock, from);
        break;

      case 'neko':
        await sendNekoImage(sock, from);
        break;

      case 'waifu':
        await sendWaifuImage(sock, from);
        break;

      case 'hug':
        await sendAction(sock, from, 'hug', args);
        break;

      case 'kiss':
        await sendAction(sock, from, 'kiss', args);
        break;

      case 'pat':
        await sendAction(sock, from, 'pat', args);
        break;

      case 'slap':
        await sendAction(sock, from, 'slap', args);
        break;

      case 'ping':
        await sock.sendMessage(from, {
          text: `${config.styles.colors.success} ¡Pong! Estoy activo ${config.styles.colors.main}`
        });
        break;

      case 'owner':
        await sock.sendMessage(from, {
          text: `${config.styles.colors.main} Creado por: ${config.owner} ${config.styles.colors.secondary}`
        });
        break;

      default:
        await sock.sendMessage(from, {
          text: `${config.styles.colors.error} Comando no reconocido. Usa ${config.prefix}help para ver los comandos disponibles.`
        });
    }
  } catch (error) {
    console.error(`${config.styles.colors.error} Error en comando:`, error);
    await sock.sendMessage(from, {
      text: `${config.styles.colors.error} Hubo un error al procesar el comando.`
    });
  }
}

// Enviar menú
async function sendMenu(sock, from) {
  const menu = `
${config.styles.colors.main} ${config.styles.prefix}
✧･ﾟ: *${config.botName}* :*ﾟ･✧
${config.styles.colors.main} ${config.styles.prefix}

━━━━━━━━━━━━━━━━━━━━━━━━
📸 *ACCIONES*
${config.styles.colors.secondary}
#hug @usuario - Abrazo
#kiss @usuario - Beso
#pat @usuario - Acaricia
#slap @usuario - Bofetada

━━━━━━━━━━━━━━━━━━━━━━━━
🖼️ *IMÁGENES*

#neko - Neko aleatorio
#waifu - Waifu aleatorio

━━━━━━━━━━━━━━━━━━━━━━━━
🎮 *JUEGOS*

Próximamente...

━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ *UTILIDADES*

#ping - Ver si estoy activo
#owner - Información del creador

━━━━━━━━━━━━━━━━━━━━━━━━

${config.styles.colors.main} ≽^•ˑ•ྀི≼ Soy Dio, tu bot supremo ≽^•ˑ•ྀི≼ ${config.styles.colors.main}
  `;

  await sock.sendMessage(from, { text: menu });
}

// Enviar imagen Neko
async function sendNekoImage(sock, from) {
  try {
    const axios = require('axios');
    const response = await axios.get(`${config.nekosApi}/img/neko`);
    const imageUrl = response.data.url;

    await sock.sendMessage(from, {
      image: { url: imageUrl },
      caption: `${config.styles.colors.main} ≽^•ˑ•ྀི≼ Neko uwu ≽^•ˑ•ྀི≼ ${config.styles.colors.main}`
    });
  } catch (error) {
    console.error('Error obteniendo imagen neko:', error);
    await sock.sendMessage(from, {
      text: `${config.styles.colors.error} No pude obtener la imagen neko...`
    });
  }
}

// Enviar imagen Waifu
async function sendWaifuImage(sock, from) {
  try {
    const axios = require('axios');
    const response = await axios.get(`${config.waifuApi}/search?is_nsfw=false&many=false`);
    const imageUrl = response.data.images[0].url;

    await sock.sendMessage(from, {
      image: { url: imageUrl },
      caption: `${config.styles.colors.secondary} ✧･ﾟ: *Waifu* :*ﾟ･✧ ${config.styles.colors.secondary}`
    });
  } catch (error) {
    console.error('Error obteniendo imagen waifu:', error);
    await sock.sendMessage(from, {
      text: `${config.styles.colors.error} No pude obtener la imagen waifu...`
    });
  }
}

// Enviar acción
async function sendAction(sock, from, action, args) {
  const actions = {
    hug: '≽^•ˑ•ྀི≼ *abraza* a',
    kiss: '💋 *besa* a',
    pat: '≽^•ˑ•ྀི≼ *acaricia* a',
    slap: '�� *bofetea* a'
  };

  const mention = args[0] ? `@${args[0]}` : 'alguien';
  const message = `${config.styles.colors.main} ${actions[action]} ${mention} ${config.styles.colors.main}`;

  await sock.sendMessage(from, { text: message });
}

// Iniciar bot
console.log(`\n${config.styles.colors.main} ${config.styles.prefix}`);
console.log(`${config.styles.colors.main} Iniciando ${config.botName} v${config.version}...`);
console.log(`${config.styles.colors.main} ${config.styles.prefix}\n`);

initializeBot().catch(console.error);

// Manejo de errores global
process.on('uncaughtException', (error) => {
  console.error(`${config.styles.colors.error} Error no capturado:`, error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`${config.styles.colors.error} Promesa rechazada:`, reason);
});