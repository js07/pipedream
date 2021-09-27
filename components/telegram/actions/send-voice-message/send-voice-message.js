const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-send-voice-message",
  name: "Send a Voice Message",
  description: "Sends a voice message",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
