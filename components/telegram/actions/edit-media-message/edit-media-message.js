const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-edit-media-message",
  name: "Edit a Media Message",
  description: "Edits photo or video messages",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
  },
  async run() {

  },
};
