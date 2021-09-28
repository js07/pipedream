const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-list-chats",
  name: "List Chats",
  description: "List available Telegram chats",
  version: "0.0.6",
  type: "action",
  props: {
    telegram,
    offset: {
      propDefinition: [
        telegram,
        "offset",
      ],
    },
    limit: {
      propDefinition: [
        telegram,
        "limit",
      ],
    },
    autoPaging: {
      propDefinition: [
        telegram,
        "autoPaging",
      ],
    },
  },
  methods: {
    generateResultFromUpdate(update) {
      return {
        update_id: update.update_id,
        ...Object.keys(update).reduce((resultPart, key) => {
          return (resultPart.chat
            ? resultPart
            : {
              chat: update[key].chat,
              from: update[key].from,
              forward_from_chat: update[key].forward_from_chat,
            });
        }, {}),
      };
    },
  },
  async run() {
    const updates = await this.telegram.getUpdates({
      offset: this.offset,
      limit: this.limit,
    });
    return updates.map(this.generateResultFromUpdate);
  },
};
