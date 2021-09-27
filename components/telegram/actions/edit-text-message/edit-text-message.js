const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-edit-text-message",
  name: "Edit a Text Message",
  description: "Edits text of game messages",
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
    fromChatId: {
      propDefinition: [
        telegram,
        "fromChatId",
      ],
    },
    messageId: {
      propDefinition: [
        telegram,
        "messageId",
      ],
    },
    disable_notification: {
      propDefinition: [
        telegram,
        "disable_notification",
      ],
    },
  },
  async run() {

  },
};
