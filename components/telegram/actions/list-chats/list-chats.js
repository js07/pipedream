const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-list-chats",
  name: "List Chats",
  description: "List available Telegram chats",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
