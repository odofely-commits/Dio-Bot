const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Boom } = require('baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Importar módulos de comandos
const { handleAction, sendActionImage } = require('./commands/acciones');
const { sendNekoImage, sendWaifuImage, sendMaidImage, sendKitsuneImage } = require('./commands/imagenes');
const { playTrivia, playTruthOrDare, playEightBall, playCoinFlip, playChoose } = require('./commands/juegos');
const { checkBalance, claimDaily, giveCoins, playRoulette } = require('./commands/economia');
const { warnUser, checkWarns, muteUser, unmuteUser, kickUser, banUser, clearWarns } = require('./commands/moderacion');
const { showProfile, showStats, showLevel, showAvatar } = require('./commands/perfil');
const { sendHelp, sendInfo, sendVersion, ping, sendOwnerInfo } = require('./commands/utilidades');

let sock;
let isConnected = false;

const authDir = './sessions';
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

async function initializeBot() {
  const { state, saveCreds } = await useMultiFileAuthState(authDir);

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

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

  sock.ev.on('creds.update', saveCreds);

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

      if (!messageText.startsWith(config.prefix)) return;

      const commandName = messageText.slice(config.prefix.length).split(' ')[0].toLowerCase();
      const args = messageText.slice(config.prefix.length).split(' ').slice(1);
      const userId = msg.key.participant || from;

      console.log(`${config.styles.colors.main} Comando: ${commandName} | Args: ${args.join(', ')}`);

      await handleCommand(sock, from, userId, commandName, args, msg);

    } catch (error) {
      console.error(`${config.styles.colors.error} Error:`, error);
    }
  });
}

async function handleCommand(sock, from, userId, command, args, msg) {
  try {
    switch (command) {
      // ACCIONES
      case 'hug':
      case 'kiss':
      case 'pat':
      case 'slap':
      case 'bite':
      case 'lick':
      case 'cuddle':
      case 'poke':
      case 'tickle':
      case 'punch':
        await sendActionImage(sock, from, command);
        break;

      // IMÁGENES
      case 'neko':
        await sendNekoImage(sock, from);
        break;
      case 'waifu':
        await sendWaifuImage(sock, from);
        break;
      case 'maid':
        await sendMaidImage(sock, from);
        break;
      case 'kitsune':
      case 'fox':
        await sendKitsuneImage(sock, from);
        break;

      // JUEGOS
      case 'trivia':
        await playTrivia(sock, from);
        break;
      case 'truth':
        await playTruthOrDare(sock, from, 'truth');
        break;
      case 'dare':
      case 'reto':
        await playTruthOrDare(sock, from, 'dare');
        break;
      case '8ball':
      case 'ball':
        await playEightBall(sock, from);
        break;
      case 'volado':
      case 'coinflip':
      case 'flip':
        await playCoinFlip(sock, from);
        break;
      case 'elige':
      case 'choose':
        await playChoose(sock, from, args);
        break;

      // ECONOMÍA
      case 'balance':
      case 'bal':
      case 'coins':
        await checkBalance(sock, from, userId);
        break;
      case 'daily':
        await claimDaily(sock, from, userId);
        break;
      case 'give':
      case 'pay':
      case 'transfer':
        if (args.length < 2) {
          await sock.sendMessage(from, {
            text: `${config.styles.colors.error} Uso: ${config.prefix}give @usuario cantidad`
          });
        } else {
          await giveCoins(sock, from, userId, args[0], args[1]);
        }
        break;
      case 'ruleta':
      case 'roulette':
      case 'rt':
        if (!args[0]) {
          await sock.sendMessage(from, {
            text: `${config.styles.colors.error} Uso: ${config.prefix}ruleta <cantidad>`
          });
        } else {
          await playRoulette(sock, from, userId, args[0]);
        }
        break;

      // MODERACIÓN
      case 'warn':
        if (!args[0]) {
          await sock.sendMessage(from, {
            text: `${config.styles.colors.error} Uso: ${config.prefix}warn @usuario [razón]`
          });
        } else {
          await warnUser(sock, from, args[0], args.slice(1).join(' '));
        }
        break;
      case 'warns':
        if (!args[0]) {
          await sock.sendMessage(from, {
            text: `${config.styles.colors.error} Uso: ${config.prefix}warns @usuario`
          });
        } else {
          await checkWarns(sock, from, args[0]);
        }
        break;
      case 'mute':
        if (!args[0]) {
          await sock.sendMessage(from, {
            text: `${config.styles.colors.error} Uso: ${config.prefix}mute @usuario [tiempo]`
          });
        } else {
          await muteUser(sock, from, args[0], args[1] || 3600);
        }
        break;
      case 'unmute':
        if (!args[0]) {
          await sock.sendMessage(from, {
            text: `${config.styles.colors.error} Uso: ${config.prefix}unmute @usuario`
          });
        } else {
          await unmuteUser(sock, from, args[0]);
        }
        break;
      case 'kick':
        if (!args[0]) {
          await sock.sendMessage(from, {
            text: `${config.styles.colors.error} Uso: ${config.prefix}kick @usuario`
          });
        } else {
          await kickUser(sock, from, args[0]);
        }
        break;
      case 'ban':
        if (!args[0]) {
          await sock.sendMessage(from, {
            text: `${config.styles.colors.error} Uso: ${config.prefix}ban @usuario`
          });
        } else {
          await banUser(sock, from, args[0]);
        }
        break;
      case 'clearwarns':
        if (!args[0]) {
          await sock.sendMessage(from, {
            text: `${config.styles.colors.error} Uso: ${config.prefix}clearwarns @usuario`
          });
        } else {
          await clearWarns(sock, from, args[0]);
        }
        break;

      // PERFIL
      case 'perfil':
      case 'profile':
        await showProfile(sock, from, userId);
        break;
      case 'stats':
      case 'estadisticas':
        await showStats(sock, from, userId);
        break;
      case 'level':
      case 'nivel':
        await showLevel(sock, from, userId);
        break;
      case 'avatar':
        if (args[0]) {
          await showAvatar(sock, from, args[0]);
        } else {
          await showAvatar(sock, from, userId);
        }
        break;

      // UTILIDADES
      case 'help':
      case 'menu':
      case 'commands':
      case 'comandos':
        await sendHelp(sock, from);
        break;
      case 'info':
      case 'botinfo':
        await sendInfo(sock, from);
        break;
      case 'version':
      case 'v':
        await sendVersion(sock, from);
        break;
      case 'ping':
        await ping(sock, from);
        break;
      case 'owner':
      case 'creador':
        await sendOwnerInfo(sock, from);
        break;

      default:
        await sock.sendMessage(from, {
          text: `${config.styles.colors.error} Comando no reconocido ≽^•ˑ•ྀི≼\n\nUsa ${config.prefix}help para ver los comandos disponibles`
        });
    }
  } catch (error) {
    console.error(`${config.styles.colors.error} Error:`, error);
    await sock.sendMessage(from, {
      text: `${config.styles.colors.error} Hubo un error al procesar el comando.`
    }).catch(() => {});
  }
}

console.log(`\n${config.styles.colors.main} ${config.styles.prefix}`);
console.log(`${config.styles.colors.main} Iniciando ${config.botName} v${config.version}...`);
console.log(`${config.styles.colors.main} ${config.styles.prefix}\n`);

initializeBot().catch(console.error);

process.on('uncaughtException', (error) => {
  console.error(`${config.styles.colors.error} Error no capturado:`, error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`${config.styles.colors.error} Promesa rechazada:`, reason);
});
