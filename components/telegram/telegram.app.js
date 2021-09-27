const axios = require("axios");
const updateTypes = [
  {
    label: "Message",
    value: "message",
  },
  {
    label: "Edited Message",
    value: "edited_message",
  },
  {
    label: "Channel Post",
    value: "channel_post",
  },
  {
    label: "Edited Channel Post",
    value: "edited_channel_post",
  },
  {
    label: "Inline Query",
    value: "inline_query",
  },
  {
    label: "Chosen Inline Result",
    value: "chosen_inline_result",
  },
  {
    label: "Callback Query",
    value: "callback_query",
  },
  {
    label: "Shipping Query",
    value: "shipping_query",
  },
  {
    label: "Pre Checkout Query",
    value: "pre_checkout_query",
  },
  {
    label: "Poll",
    value: "poll",
  },
  {
    label: "Poll Answer",
    value: "poll_answer",
  },
];

module.exports = {
  type: "app",
  app: "telegram_bot_api",
  propDefinitions: {
    updateTypes: {
      type: "string[]",
      label: "Update Types",
      optional: true,
      description:
        "Only emit events for the selected update types.",
      options: updateTypes,
    },
    chatId: {
      type: "string",
      label: "Chat ID",
      description: "Enter the unique identifier for the target chat or username of the target channel (in the format @channelusername, or @supergroupusername).",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Enter or map the message text to send.",
      optional: true,
    },
    parse_mode: {
      type: "string",
      label: "Parse Mode",
      description: "Select Markdown-style or HTML-style of the text, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.",
      options: [
        "Markdown",
        "HTML",
      ],
      optional: true,
    },
    disable_notification: {
      type: "boolean",
      label: "Disable Notifications",
      description: "Choose if to send the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.",
      optional: true,
    },
    disable_web_page_preview: {
      type: "boolean",
      label: "Disable Link Previews",
      description: "Choose if to disable link previews for links in this message.",
      optional: true,
    },
    reply_to_message_id: {
      type: "string",
      label: "Original Message ID",
      description: "Enter the ID of the original message.",
      optional: true,
    },
    // enterReplyMarkupField: {
    //   type: "string",
    //   label: "Enter/Assemble the Reply Markup Field",
    //   description: "Select if to enter or assemble the reply markup field.",
    //   optional: true,
    // },
    reply_markup: {
      type: "string",
      label: "Reply Markup",
      description: "Enter additional interface options that are a JSON-serialized object including an inline keyboard, a custom reply keyboard, instructions to remove the reply keyboard or instructions to force a reply from the user, e.g. {\"inline_keyboard\":[[{\"text\":\"Some button text 2\",\"url\":\"https://botpress.org\"}]]} or {\"keyboard\":[[\"Yes\",\"No\"],[\"Maybe\"]]}. Note: keyboard cannot be used with channels.",
      optional: true,
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "Enter the message ID.",
    },
    fromChatId: {
      type: "string",
      label: "From Chat ID",
      description: "Enter the unique identifier for the chat where the original message was sent (or channel username in the format @channelusername).",
      optional: true,
    },
    caption: {
      type: "string",
      label: "Caption",
      description: "Enter the audio caption.",
      optional: true,
    },
    // sendBy: {
    //   type: "string",
    //   label: "Send by",
    //   description: "Select if to send using data, by HTTP URL or by file ID.",
    //   options: [
    //     "Data",
    //     "HTTP URL",
    //     "File ID",
    //   ],
    //   optional: true,
    // },
    filename: {
      type: "string",
      label: "Source File Name",
      description: "Enter a filename.",
    },
    fileSource: {
      type: "string",
      label: "File Data Source",
      description: "The source of the file data.",
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "Enter duration of sent video in seconds.",
      optional: true,
    },
    performer: {
      type: "string",
      label: "Performer",
      description: "Enter a performer.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Enter a track name.",
      optional: true,
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "Select or enter the MIME type of data.",
      optional: true,
    },
    width: {
      type: "integer",
      label: "Width",
      description: "Enter the video width.",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "Enter the video height.",
      optional: true,
    },
    length: {
      type: "integer",
      label: "Length",
      description: "Enter the video width and height.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Media Type",
      description: "Select the media type.",
      options: [
        "Photo",
        "Video",
      ],
      optional: true,
    },
    startOffset: {
      type: "string",
      label: "Start offset (Update ID)",
      description: "Enter the update ID <1, last update ID> you want to list from. Note: you can use this field to set your pagination - map last update ID from the result and increase this value by one to get next page.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Limits the number of updates to be retrieved <1-100>. It is valid only for the case if auto-paging is not checked - see the parameter below.",
      optional: true,
    },
    autoPaging: {
      type: "boolean",
      label: "Confirm processed requests by increasing the offset in the Telegram server [auto-paging]",
      description: "Check if to simulate a webhook by increasing the offset automatically. Caution: you can list all updates automatically but only once. The limit will be ignored.",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Enter the unique identifier of the target user.",
      optional: true,
    },
    untilDate: {
      type: "string",
      label: "Until Date",
      description: "Enter the date when the user will be unbanned. Time zone: America/Denver. For more information about supported date formats, see the [online Help](https://www.integromat.com/en/kb/type-coercion.html).",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://api.telegram.org/bot${this.$auth.token}`;
    },
    _getHeaders() {
      return {
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    async createHook(url, allowedUpdates) {
      const config = {
        method: "POST",
        url: `${this._getBaseUrl()}/setWebhook`,
        headers: this._getHeaders(),
        data: {
          url: `${url}/${this.$auth.token}`,
          allowed_updates: allowedUpdates,
        },
      };
      return await axios(config);
    },
    async deleteHook() {
      const config = {
        method: "GET",
        url: `${await this._getBaseUrl()}/deleteWebhook`,
        headers: await this._getHeaders(),
      };
      return await axios(config);
    },
  },
};
