const config = require('../config');

// Almacenamiento de datos de usuarios (en producción usar base de datos)
const userDatabase = {};

function getOrCreateUser(userId) {
  if (!userDatabase[userId]) {
    userDatabase[userId] = {
      balance: 1000,
      level: 1,
      experience: 0,
      dailyClaimed: false,
      lastDaily: null
    };
  }
  return userDatabase[userId];
}

async function checkBalance(sock, from, userId) {
  try {
    const user = getOrCreateUser(userId);
    
    const message = `
${config.styles.colors.main} ${config.styles.prefix} BALANCE ${config.styles.prefix}

💰 Balance: ${user.balance}
📊 Nivel: ${user.level}
✨ Experiencia: ${user.experience}

${config.styles.colors.secondary} Usa #daily para ganar dinero
${config.styles.colors.main}`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error verificando balance:', error);
  }
}

async function claimDaily(sock, from, userId) {
  try {
    const user = getOrCreateUser(userId);
    const now = new Date();
    const lastDaily = user.lastDaily ? new Date(user.lastDaily) : null;

    // Verificar si ya reclamo hoy
    if (lastDaily && lastDaily.toDateString() === now.toDateString()) {
      await sock.sendMessage(from, {
        text: `${config.styles.colors.error} Ya reclamaste tu recompensa diaria. Intenta mañana 🕐`
      });
      return;
    }

    const reward = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
    user.balance += reward;
    user.lastDaily = now.toISOString();

    const message = `
${config.styles.colors.main} ${config.styles.prefix} RECOMPENSA DIARIA ${config.styles.prefix}

${config.styles.colors.success} ¡Reclamaste tu recompensa!

💰 +${reward}
💰 Balance total: ${user.balance}

${config.styles.colors.secondary} Vuelve mañana para otra recompensa
${config.styles.colors.main}`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error reclamando daily:', error);
  }
}

async function giveCoins(sock, from, userId, targetUser, amount) {
  try {
    const user = getOrCreateUser(userId);
    const target = getOrCreateUser(targetUser);

    const amountNum = parseInt(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      await sock.sendMessage(from, {
        text: `${config.styles.colors.error} Cantidad inválida`
      });
      return;
    }

    if (user.balance < amountNum) {
      await sock.sendMessage(from, {
        text: `${config.styles.colors.error} No tienes suficientes monedas`
      });
      return;
    }

    user.balance -= amountNum;
    target.balance += amountNum;

    const message = `
${config.styles.colors.main} ${config.styles.prefix} TRANSFERENCIA ${config.styles.prefix}

${config.styles.colors.success} Transferencia completada!

💰 -${amountNum}
💰 Tu nuevo balance: ${user.balance}

${config.styles.colors.secondary} Compartir es cuidado <3
${config.styles.colors.main}`;

    await sock.sendMessage(from, { text: message });
  } catch (error) {
    console.error('Error transfiriendo coins:', error);
  }
}

async function playRoulette(sock, from, userId, bet) {
  try {
    const user = getOrCreateUser(userId);
    const betNum = parseInt(bet);

    if (isNaN(betNum) || betNum <= 0) {
      await sock.sendMessage(from, {
        text: `${config.styles.colors.error} Apuesta inválida`
      });
      return;
    }

    if (user.balance < betNum) {
      await sock.sendMessage(from, {
        text: `${config.styles.colors.error} No tienes suficientes monedas`
      });
      return;
    }

    const won = Math.random() > 0.5;
    
    if (won) {
      user.balance += betNum;
      user.experience += 10;
      
      const message = `
${config.styles.colors.main} ${config.styles.prefix} ¡GANASTE! ${config.styles.prefix}

${config.styles.colors.success} 🎰 ¡JACKPOT!

💰 +${betNum}
💰 Balance: ${user.balance}

${config.styles.colors.secondary} Suerte te acompaña <3
${config.styles.colors.main}`;

      await sock.sendMessage(from, { text: message });
    } else {
      user.balance -= betNum;
      
      const message = `
${config.styles.colors.main} ${config.styles.prefix} PERDISTE ${config.styles.prefix}

${config.styles.colors.error} 🎰 Mala suerte

💰 -${betNum}
💰 Balance: ${user.balance}

${config.styles.colors.secondary} Intenta de nuevo
${config.styles.colors.main}`;

      await sock.sendMessage(from, { text: message });
    }
  } catch (error) {
    console.error('Error en ruleta:', error);
  }
}

module.exports = { 
  checkBalance, 
  claimDaily, 
  giveCoins, 
  playRoulette,
  getOrCreateUser 
};
