const config = require('../config');

async function showProfile(sock, from, userId) {
  try {
    const profile = `
✧･ﾟ: *PERFIL* :*ﾟ･✧

| Usuario: ${userId}
| Nivel: 5 (๑•́ㅂ•́)و
| Experiencia: 2,450/5000 ✨
| Balance: 5,432 💜

━━━━━━━━━━━━━━━━━━━━━━━

*Estadísticas*

• Horas jugadas: 42
• Comandos usados: 128
• Partidas ganadas: 23
• Racha actual: 5 días

━━━━━━━━━━━━━━━━━━━━━━━

${config.styles.colors.main} Sigue ganando experiencia <3
`;

    await sock.sendMessage(from, { text: profile });
  } catch (error) {
    console.error('Error mostrando perfil:', error);
  }
}

async function showStats(sock, from, userId) {
  try {
    const stats = `
✧･ﾟ: *ESTADÍSTICAS* :*ﾟ･✧

*Juegos*

• Trivia jugadas: 15
• Trivia ganadas: 12
• Porcentaje: 80% (๑>◡<๑)

*Economía*

• Coins ganados: 15,234 💜
• Coins gastados: 8,900
• Balance actual: 6,334

*Acciones*

• Abrazos dados: 42
• Besos dados: 28
• Bofetadas dadas: 15

━━━━━━━━━━━━━━━━━━━━━━━

${config.styles.colors.secondary} ¡Sigue divirtiéndote! <3
`;

    await sock.sendMessage(from, { text: stats });
  } catch (error) {
    console.error('Error mostrando stats:', error);
  }
}

async function showLevel(sock, from, userId) {
  try {
    const level = `
✧･ﾟ: *NIVEL* :*ﾟ･✧

*Tu Nivel Actual*

| Nivel: 5
| Experiencia: 2,450/5000 XP
| Progreso: ████████░░ 49%

*Siguiente Nivel*

| Falta: 2,550 XP
| Recompensa: 500 💜 + Insignia

━━━━━━━━━━━━━━━━━━━━━━━

${config.styles.colors.success} ¡Casi lo logras! (๑•́ㅂ•́)و
`;

    await sock.sendMessage(from, { text: level });
  } catch (error) {
    console.error('Error mostrando nivel:', error);
  }
}

async function showAvatar(sock, from, userId) {
  try {
    const avatar = `
✧･ﾟ: *AVATAR* :*ﾟ･✧

| Usuario: ${userId}
| Avatar: 👤
| Estado: Activo ✓

${config.styles.colors.main}
`;

    await sock.sendMessage(from, { text: avatar });
  } catch (error) {
    console.error('Error mostrando avatar:', error);
  }
}

module.exports = { showProfile, showStats, showLevel, showAvatar };
