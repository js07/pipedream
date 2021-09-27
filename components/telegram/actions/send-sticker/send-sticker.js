const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-send-sticker",
  name: "Send a Sticker",
  description: "Sends a .webp sticker to you Telegram Desktop application",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
    chatId: {
      propDefinition: [
        telegram,
        "chatId",
      ],
    },
    filename: {
      propDefinition: [
        telegram,
        "filename",
      ],
    },
    fileSource: {
      propDefinition: [
        telegram,
        "fileSource",
      ],
    },
    reply_to_message_id: {
      propDefinition: [
        telegram,
        "reply_to_message_id",
      ],
    },
    reply_markup: {
      propDefinition: [
        telegram,
        "reply_markup",
      ],
    },
  },
  async run() {

  },
};
