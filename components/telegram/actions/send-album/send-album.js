const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-send-album",
  name: "Send an Album (Media Group)",
  description: "Sends a group of photos or videos as an album",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
