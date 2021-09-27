const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-send-audio-file",
  name: "Send an Audio File",
  description: "Sends an audio file to your Telegram Desktop application",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
