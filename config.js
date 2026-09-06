require('dotenv').config();

const config = {
  // Bot Configuration
  botName: process.env.BOT_NAME || 'Dio-Bot',
  prefix: process.env.BOT_PREFIX || '#',
  owner: process.env.BOT_OWNER || 'odofely-commits',
  version: process.env.BOT_VERSION || '1.0.0',
  
  // APIs
  nekosApi: process.env.NEKOS_API || 'https://api.nekos.life/v2',
  waifuApi: process.env.WAIFU_API || 'https://api.waifu.im',
  
  // Bot Settings
  debug: process.env.DEBUG === 'true',
  
  // Aesthetic Styles
  styles: {
    greeting: "≽^•ˑ•ྀི≼ ¡ʜᴏʟᴀ! sᴏʏ ᴅɪᴏ, ᴛᴜ ʙᴏᴛ sᴜᴘʀᴇᴍᴏ ≽^•ˑ•ྀི≼",
    prefix: "✧･ﾟ: *✧･ﾟ:*",
    divider: "━━━━━━━━━━━━━━━━",
    colors: {
      main: "💜",
      secondary: "💚",
      success: "✨",
      error: "⚠️"
    }
  },
  
  // Command Categories
  commandCategories: [
    'acciones',
    'imagenes',
    'juegos',
    'economia',
    'moderacion',
    'perfil',
    'musica',
    'utilidades'
  ]
};

module.exports = config;