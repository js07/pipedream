const telegram = require("../../telegram.app.js");
const { TELEGRAM_BOT_API_UI_MEDIA_TYPES } = require("../../constants.js");

module.exports = {
  key: "telegram-send-media-by-url-or-id",
  name: "Send Media by URL or ID",
  description: "Sends a file (document, photo, video, audio, ...) by HTTP URL or by ID that exists on the Telegram servers",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
    chat_id: {
      propDefinition: [
        telegram,
        "chatId",
      ],
    },
    caption: {
      propDefinition: [
        telegram,
        "caption",
      ],
    },
    mediaType: {
      propDefinition: [
        telegram,
        "type",
      ],
      options: TELEGRAM_BOT_API_UI_MEDIA_TYPES,
    },
    fileSource: {
      propDefinition: [
        telegram,
        "fileSource",
      ],
    },
    disable_notification: {
      propDefinition: [
        telegram,
        "disable_notification",
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
