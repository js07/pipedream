const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-edit-text-message",
  name: "Edit a Text Message",
  description: "Edits text of game messages",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
