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
    until_date: {
      propDefinition: [
        telegram,
        "until_date",
      ],
    },
  },
  async run() {
    return await this.telegram.banChatMember(this.chatId, this.userId, {
      until_date: this.until_date,
    });
  },
};
