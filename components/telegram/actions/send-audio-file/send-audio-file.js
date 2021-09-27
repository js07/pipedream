const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-send-audio-file",
  name: "Send an Audio File",
  description: "Sends an audio file to your Telegram Desktop application",
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
      description: "Enter the audio caption.",
    },
    filename: {
      propDefinition: [
        telegram,
        "filename",
      ],
    },
    audio: {
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
    disable_notification: {
      propDefinition: [
        telegram,
        "disable_notification",
      ],
    },
    duration: {
      propDefinition: [
        telegram,
        "duration",
      ],
    },
    performer: {
      propDefinition: [
        telegram,
        "performer",
      ],
    },
    title: {
      propDefinition: [
        telegram,
        "title",
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
