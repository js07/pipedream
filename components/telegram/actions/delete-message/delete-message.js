const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-delete-message",
  name: "Delete a Message",
  description: "Deletes a message",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
