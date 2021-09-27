const telegram = require("../../telegram.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram-send-voice-message",
  name: "Send a Voice Message",
  description: "Sends a voice message",
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
    contentType: {
      propDefinition: [
        telegram,
        "contentType",
      ],
      options: contentTypes.audio,
    },
    duration: {
      propDefinition: [
        telegram,
        "duration",
      ],
      description: "Enter the duration of sent voice message in seconds.",
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
