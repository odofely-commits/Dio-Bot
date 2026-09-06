const axios = require('axios');
const config = require('../config');

async function sendNekoImage(sock, from) {
  try {
    const response = await axios.get(`${config.nekosApi}/img/neko`);
    const imageUrl = response.data.url;

    await sock.sendMessage(from, {
      image: { url: imageUrl },
      caption: `${config.styles.colors.main} ≽^•ˑ•ྀི≼ Neko random ≽^•ˑ•ྀི≼ ${config.styles.colors.main}`
    });
  } catch (error) {
    console.error('Error obteniendo neko:', error);
    await sock.sendMessage(from, {
      text: `${config.styles.colors.error} Error al obtener imagen de neko`
    });
  }
}

async function sendWaifuImage(sock, from) {
  try {
    const response = await axios.get(`${config.waifuApi}/search/?is_nsfw=false&many=false`);
    const imageUrl = response.data.images[0].url;

    await sock.sendMessage(from, {
      image: { url: imageUrl },
      caption: `${config.styles.colors.main} ✧･ﾟ Waifu random ✧･ﾟ ${config.styles.colors.main}`
    });
  } catch (error) {
    console.error('Error obteniendo waifu:', error);
    await sock.sendMessage(from, {
      text: `${config.styles.colors.error} Error al obtener imagen de waifu`
    });
  }
}

async function sendMaidImage(sock, from) {
  try {
    const response = await axios.get(`${config.waifuApi}/search/?tag=maid&is_nsfw=false&many=false`);
    const imageUrl = response.data.images[0].url;

    await sock.sendMessage(from, {
      image: { url: imageUrl },
      caption: `${config.styles.colors.main} (๑•́ㅂ•́)و Maid random (๑•́ㅂ•́)و ${config.styles.colors.main}`
    });
  } catch (error) {
    console.error('Error obteniendo maid:', error);
    await sock.sendMessage(from, {
      text: `${config.styles.colors.error} Error al obtener imagen de maid`
    });
  }
}

async function sendKitsuneImage(sock, from) {
  try {
    const response = await axios.get(`${config.waifuApi}/search/?tag=kitsune&is_nsfw=false&many=false`);
    const imageUrl = response.data.images[0].url;

    await sock.sendMessage(from, {
      image: { url: imageUrl },
      caption: `${config.styles.colors.main} 🦊 Kitsune random 🦊 ${config.styles.colors.main}`
    });
  } catch (error) {
    console.error('Error obteniendo kitsune:', error);
    await sock.sendMessage(from, {
      text: `${config.styles.colors.error} Error al obtener imagen de kitsune`
    });
  }
}

module.exports = { sendNekoImage, sendWaifuImage, sendMaidImage, sendKitsuneImage };
