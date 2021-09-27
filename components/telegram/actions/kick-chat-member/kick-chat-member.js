const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-kick-chat-member",
  name: "Kick a Chat Member",
  description: "Use this method to kick a user from a group, a supergroup or channel",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
    chatId: {
      propDefinition: [
        telegram,
        "chatId",
      ],
    },
    userId: {
      propDefinition: [
        telegram,
        "userId",
      ],
    },
    untilDate: {
      propDefinition: [
        telegram,
        "untilDate",
      ],
    },
  },
  async run() {

  },
};
