const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-promote-chat-member",
  name: "Promote a Chat Member",
  description: "Use this method to promote or demote a user in a supergroup or a channel",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
