const googleSheets = require("../../google_sheets.app");

module.exports = {
  key: "google_sheets-get-values-in-range",
  name: "Get Values in Range",
  description: "Get values from a range of cells using A1 notation.",
  version: "0.0.5",
  type: "action",
  props: {
    googleSheets,
    drive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "The drive to use. Enable structured mode to select a [shared drive](https://support.google.com/a/users/answer/9310351).",
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
    sheetName: {
      propDefinition: [
        googleSheets,
        "sheetName",
        (c) => ({
          sheetId: c.sheetId,
        }),
      ],
    },
    range: {
      propDefinition: [
        googleSheets,
        "range",
      ],
    },
  },
  async run() {
    const sheets = this.googleSheets.sheets();

    return (await sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `${this.sheetName}!${this.range}`,
    })).data.values;
  },
};
