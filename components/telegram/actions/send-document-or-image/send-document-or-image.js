const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-send-document-or-image",
  name: "Send a Document/Image",
  description: "Sends a document or an image to your Telegram Desktop application",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
