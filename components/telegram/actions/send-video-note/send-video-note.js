const telegram = require("../../telegram.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram-send-video-note",
  name: "Send a Video Note",
  description: "As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages",
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
    contentType: {
      propDefinition: [
        telegram,
        "contentType",
      ],
      options: contentTypes.video,
    },
    length: {
      propDefinition: [
        telegram,
        "length",
      ],
    },
    duration: {
      propDefinition: [
        telegram,
        "duration",
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
