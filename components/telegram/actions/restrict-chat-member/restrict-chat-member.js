const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-restrict-chat-member",
  name: "Restrict a Chat Member",
  description: "Use this method to restrict a user in a supergroup",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
