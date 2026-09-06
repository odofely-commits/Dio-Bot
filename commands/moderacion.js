const config = require('../config');

// Almacenamiento de datos de moderación
const warnsDatabase = {};

function getOrCreateUserWarns(userId) {
  if (!warnsDatabase[userId]) {
    warnsDatabase[userId] = {
      warns: 0,
      reasons: [],
      muted: false,
      muteTime: null
    };
  }
  return warnsDatabase[userId];
}

async function warnUser(sock, from, targetUser, reason) {
  try {
    const userWarns = getOrCreateUserWarns(targetUser);
    userWarns.warns += 1;
    userWarns.reasons.push(`${new Date().toLocaleString()}: ${reason || 'Sin razón especificada'}`);

    const maxWarns = 3;
    
    let message = `
✧･ﾟ: *ADVERTENCIA* :*ﾟ･✧

⚠️ Usuario advertido!

| @${targetUser}
| Advertencias: ${userWarns.warns}/${maxWarns}
| Razón: ${reason || 'Sin especificar'}

`;

    if (userWarns.warns >= maxWarns) {
      userWarns.warns = 0;
      message += `${config.styles.colors.error} ⛔ Usuario baneado (3 advertencias)\n\n`;
    }

    message += `${config.styles.colors.secondary} Ten cuidado con el comportamiento`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error advirtiendo usuario:', error);
  }
}

async function checkWarns(sock, from, targetUser) {
  try {
    const userWarns = getOrCreateUserWarns(targetUser);

    if (userWarns.warns === 0) {
      await sock.sendMessage(from, {
        text: `${config.styles.colors.success} @${targetUser} no tiene advertencias ${config.styles.colors.main}`
      });
      return;
    }

    let warnsText = userWarns.reasons.map((reason, i) => `${i + 1}. ${reason}`).join('\n');
    
    const message = `
✧･ﾟ: *ADVERTENCIAS* :*ﾟ･✧

| @${targetUser}
| Total: ${userWarns.warns}/3

${warnsText}

${config.styles.colors.secondary} Cuidado con el comportamiento
`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error verificando advertencias:', error);
  }
}

async function muteUser(sock, from, targetUser, time = 3600) {
  try {
    const userWarns = getOrCreateUserWarns(targetUser);
    userWarns.muted = true;
    userWarns.muteTime = new Date(Date.now() + time * 1000).toISOString();

    const timeInMinutes = Math.floor(time / 60);

    const message = `
✧･ﾟ: *SILENCIADO* :*ﾟ･✧

🔇 Usuario silenciado

| @${targetUser}
| Tiempo: ${timeInMinutes} minutos

${config.styles.colors.secondary} No puede hablar en este tiempo
`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error silenciando usuario:', error);
  }
}

async function unmuteUser(sock, from, targetUser) {
  try {
    const userWarns = getOrCreateUserWarns(targetUser);
    userWarns.muted = false;
    userWarns.muteTime = null;

    const message = `
✧･ﾟ: *DESILENCIADO* :*ﾟ･✧

🔊 Usuario desilenciado

| @${targetUser}

${config.styles.colors.secondary} Puede hablar de nuevo
`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error desilenciando usuario:', error);
  }
}

async function kickUser(sock, from, targetUser) {
  try {
    const message = `
✧･ﾟ: *EXPULSIÓN* :*ﾟ･✧

🚪 Usuario expulsado

| @${targetUser}

${config.styles.colors.secondary} El usuario ha sido removido del grupo
`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error expulsando usuario:', error);
  }
}

async function banUser(sock, from, targetUser) {
  try {
    const message = `
✧･ﾟ: *BANEO* :*ﾟ･✧

⛔ Usuario baneado

| @${targetUser}

${config.styles.colors.secondary} El usuario está permanentemente baneado
`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error baneando usuario:', error);
  }
}

async function clearWarns(sock, from, targetUser) {
  try {
    const userWarns = getOrCreateUserWarns(targetUser);
    const previousWarns = userWarns.warns;
    userWarns.warns = 0;
    userWarns.reasons = [];

    const message = `
✧･ﾟ: *ADVERTENCIAS BORRADAS* :*ﾟ･✧

✅ Advertencias removidas

| @${targetUser}
| Advertencias anteriores: ${previousWarns}

${config.styles.colors.secondary} Usuario con registro limpio
`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error borrando advertencias:', error);
  }
}

module.exports = { 
  warnUser, 
  checkWarns, 
  muteUser, 
  unmuteUser, 
  kickUser, 
  banUser,
  clearWarns,
  getOrCreateUserWarns
};
