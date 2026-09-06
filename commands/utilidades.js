const config = require('../config');

async function sendHelp(sock, from) {
  try {
    const help = `
✧･ﾟ: *DIO-BOT MENU* :*ﾟ･✧

${config.styles.colors.main} ${config.styles.prefix}

*┌ ACCIONES*
| #hug @usuario     (´∀｀)♡
| #kiss @usuario    💋
| #pat @usuario     (´∀｀)♡
| #slap @usuario    👋
| #bite @usuario    (╯3╰)
| #lick @usuario    (≧◡≦)
└─────────────────────

*┌ IMÁGENES*
| #neko             Neko ≽^•ˑ•ྀི≼
| #waifu            Waifu ✧･ﾟ
| #maid             Maid (๑•́ㅂ•́)و
| #kitsune / #fox   Kitsune 🦊
└─────────────────────

*┌ JUEGOS*
| #trivia           Trivia anime
| #truth            Verdad
| #dare / #reto     Reto
| #8ball / #ball    Bola mágica 🔮
| #volado           Cara o sello 🪙
| #elige <op1> <op2>  Elige entre opciones
└─────────────────────

*┌ ECONOMÍA*
| #balance / #bal   Ver balance 💜
| #daily            Recompensa diaria
| #give @user <cant>  Transferir dinero
| #ruleta <cant>    Jugar ruleta 🎰
└─────────────────────

*┌ MODERACIÓN*
| #warn @user       Advertir usuario
| #warns @user      Ver advertencias
| #mute @user       Silenciar 🔇
| #unmute @user     Dessilenciar 🔊
| #kick @user       Expulsar 🚪
| #ban @user        Banear ⛔
| #clearwarns @user Limpiar advertencias
└─────────────────────

*┌ PERFIL*
| #perfil           Tu perfil
| #stats            Tus estadísticas
| #level            Tu nivel
| #avatar [@user]   Avatar
└─────────────────────

*┌ UTILIDADES*
| #ping             Ver si estoy activo
| #owner            Info del creador
| #info             Info del bot
| #version / #v     Versión del bot
└─────────────────────

${config.styles.colors.secondary} ≽^•ˑ•ྀི≼ Usa los comandos con ${config.prefix} ≽^•ˑ•ྀི≼
`;

    await sock.sendMessage(from, { text: help });
  } catch (error) {
    console.error('Error enviando help:', error);
  }
}

async function sendInfo(sock, from) {
  try {
    const info = `
✧･ﾟ: *INFORMACIÓN* :*ﾟ･✧

*Bot*

| Nombre: Dio-Bot 💜
| Versión: 1.0.0
| Creador: odofely-commits
| Estado: Activo ✓

*Funcionalidades*

• 50+ comandos
• Sistema de economía
• Juegos interactivos
• Moderación completa
• Perfiles de usuario
• Imágenes anime

*Conexión*

| Plataforma: WhatsApp
| Mensajes procesados: 542
| Usuarios activos: 28
| Uptime: 12 horas

━━━━━━━━━━━━━━━━━━━━━━━

${config.styles.colors.success} ¡Gracias por usar Dio-Bot! <3
`;

    await sock.sendMessage(from, { text: info });
  } catch (error) {
    console.error('Error enviando info:', error);
  }
}

async function sendVersion(sock, from) {
  try {
    const version = `
✧･ﾟ: *VERSIÓN* :*ﾟ･✧

| Versión: 1.0.0
| Estado: Estable ✓
| Última actualización: 2026-09-06

*Cambios en v1.0.0*

1. Lanzamiento inicial
2. 50+ comandos implementados
3. Sistema de economía
4. Juegos completos
5. Moderación básica
6. Perfiles de usuario

${config.styles.colors.secondary} ¡Primera versión exitosa! 🎉
`;

    await sock.sendMessage(from, { text: version });
  } catch (error) {
    console.error('Error enviando version:', error);
  }
}

async function ping(sock, from) {
  try {
    const message = `
${config.styles.colors.success} ¡Pong! 📡

| Estado: Activo ✓
| Respuesta: rápida
| Conexión: Estable

${config.styles.colors.main} Listo para usar <3
`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error en ping:', error);
  }
}

async function sendOwnerInfo(sock, from) {
  try {
    const owner = `
✧･ﾟ: *CREADOR* :*ﾟ･✧

*Información del Creador*

| Nombre: odofely-commits 💜
| GitHub: @odofely-commits
| Especialidad: Bots & Código

*Redes Sociales*

• GitHub: github.com/odofely-commits
• Discord: Pronto
• Twitter: Pronto

━━━━━━━━━━━━━━━━━━━━━━━

${config.styles.colors.secondary} ¡Dale follow al creador! <3
`;

    await sock.sendMessage(from, { text: owner });
  } catch (error) {
    console.error('Error enviando info del owner:', error);
  }
}

module.exports = { sendHelp, sendInfo, sendVersion, ping, sendOwnerInfo };
