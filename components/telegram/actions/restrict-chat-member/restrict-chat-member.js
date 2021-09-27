const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-restrict-chat-member",
  name: "Restrict a Chat Member",
  description: "Use this method to restrict a user in a supergroup",
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
    can_send_messages: {
      type: "boolean",
      label: "Set if the User Can Send Messages",
      description: "Pass True, if the user can send text messages, contacts, locations and venues.",
      optional: true,
    },
    can_send_media_messages: {
      type: "boolean",
      label: "Set if the User Can Send Media Messages",
      description: "Pass True, if the user can send audios, documents, photos, videos, video notes and voice notes, implies can_send_messages.",
      optional: true,
    },
    can_send_other_messages: {
      type: "boolean",
      label: "Set if the User Can send Other Messages",
      description: "Pass True, if the user can send animations, games, stickers and use inline bots, implies can_send_media_messages.",
      optional: true,
    },
    can_add_web_page_previews: {
      type: "boolean",
      label: "Set if the User Can Add Web Page Previews",
      description: "Pass True, if the user may add web page previews to their messages, implies can_send_media_messages.",
      optional: true,
    },
  },
  async run() {

  },
};
