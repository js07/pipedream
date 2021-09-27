const telegram = require("../../telegram.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram-send-photo",
  name: "Send a Photo",
  description: "Sends a photo to your Telegram Desktop application",
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
    caption: {
      propDefinition: [
        telegram,
        "caption",
      ],
      description: "Enter the photo caption.",
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
    disable_notification: {
      propDefinition: [
        telegram,
        "disable_notification",
      ],
    },
    parse_mode: {
      propDefinition: [
        telegram,
        "parse_mode",
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
    contentType: {
      propDefinition: [
        telegram,
        "contentType",
      ],
      options: contentTypes.image,
    },
  },
  async run() {

  },
};
