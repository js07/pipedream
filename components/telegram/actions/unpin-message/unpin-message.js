const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-unpin-message",
  name: "Unpin a Message",
  description: "Unpins a message",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
