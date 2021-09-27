const telegram = require("../../telegram.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram-send-video",
  name: "Send a Video",
  description: "Sends a video file to your Telegram Desktop application",
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
      description: "Enter the video caption.",
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
    duration: {
      propDefinition: [
        telegram,
        "duration",
      ],
    },
    width: {
      propDefinition: [
        telegram,
        "width",
      ],
    },
    height: {
      propDefinition: [
        telegram,
        "height",
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
