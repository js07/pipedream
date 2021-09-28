const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-send-album",
  name: "Send an Album (Media Group)",
  description: "Sends a group of photos or videos as an album",
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
    media: {
      type: "any",
      label: "Media",
      description: "A JSON-serialized array describing photos and videos to be sent, must include 2–10 items",
      optional: true,
    },
    disable_notification: {
      propDefinition: [
        telegram,
        "disable_notification",
      ],
    },
  },
  async run() {
    return await this.telegram.sendMediaGroup(this.chatId, this.media, {
      disable_notification: this.disable_notification,
    });
  },
};
