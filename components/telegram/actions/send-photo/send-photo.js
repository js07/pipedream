const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-send-photo",
  name: "Send a Photo",
  description: "Sends a photo to your Telegram Desktop application",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
