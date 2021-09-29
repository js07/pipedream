const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-list-updates",
  name: "List Updates",
  description: "Retrieves a list of updates from the Telegram server",
  version: "0.0.3",
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
  async run() {
    const updates = await this.telegram.getUpdates({
      offset: this.offset,
      limit: this.limit,
    });
    if (this.autoPaging && updates.length > 0) {
      const lastUpdateId = updates[updates.length - 1].update_id;
      // "Confirm" updates by calling API to get updates using an offset of the
      // last `update_id + 1` See [documentation for getUpdates in the Telegram
      // Bot API reference](https://core.telegram.org/bots/api#getupdates)
      await this.telegram.getUpdates({
        offset: lastUpdateId + 1,
        limit: 1,
      });
    }
    return updates;
  },
};
