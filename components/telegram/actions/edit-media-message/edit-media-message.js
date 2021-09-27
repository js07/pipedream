const {
  TELEGRAM_BOT_API_MEDIA_PHOTO,
  TELEGRAM_BOT_API_MEDIA_VIDEO,
} = require("../../constants.js");
const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-edit-media-message",
  name: "Edit a Media Message",
  description: "Edits photo or video messages",
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
    messageId: {
      propDefinition: [
        telegram,
        "messageId",
      ],
    },
    type: {
      propDefinition: [
        telegram,
        "type",
      ],
      options: [
        {
          label: "Photo",
          value: TELEGRAM_BOT_API_MEDIA_PHOTO,
        },
        {
          label: "Video",
          value: TELEGRAM_BOT_API_MEDIA_VIDEO,
        },
      ],
    },
    caption: {
      propDefinition: [
        telegram,
        "caption",
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
    parse_mode: {
      propDefinition: [
        telegram,
        "parse_mode",
      ],
    },
    disable_web_page_preview: {
      propDefinition: [
        telegram,
        "disable_web_page_preview",
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
