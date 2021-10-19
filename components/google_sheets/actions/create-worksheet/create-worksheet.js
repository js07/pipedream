const googleSheets = require("../../google_sheets.app");

module.exports = {
  key: "google_sheets-create-worksheet",
  name: "Create Worksheet",
  description: "Create a blank worksheet with a title",
  version: "0.0.1",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "The drive containing the spreadsheet to edit. Enable structured mode to select a [shared drive](https://support.google.com/a/users/answer/9310351).",
    },
    sheetId: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.drive),
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the new worksheet",
    },
  },
  async run() {
    const request = {
      spreadsheetId: this.sheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: this.title,
              },
            },
          },
        ],
      },
    };
    return await this.googleSheets.batchUpdate(request);
  },
};
