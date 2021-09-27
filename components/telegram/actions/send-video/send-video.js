const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-send-video",
  name: "Send a Video",
  description: "Sends a video file to your Telegram Desktop application",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
