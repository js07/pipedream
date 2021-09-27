const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-list-updates",
  name: "List Updates",
  description: "Retrieves a list of updates from the Telegram server",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
    startOffset: {
      propDefinition: [
        telegram,
        "startOffset",
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

  },
};
