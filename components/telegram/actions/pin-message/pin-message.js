const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-pin-message",
  name: "Pin a Message",
  description: "Pins a message",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
