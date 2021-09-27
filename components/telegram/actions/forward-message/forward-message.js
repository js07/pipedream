const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-forward-message",
  name: "Forward a Message",
  description: "Forwards messages of any kind",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
