const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-send-text-message-or-reply",
  name: "Send a Text Message or Reply",
  description: "Sends a text message or a reply to your Telegram Desktop application",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
