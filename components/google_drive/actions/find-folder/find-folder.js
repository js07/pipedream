const googleDrive = require("../../google_drive.app");
const common = require("../common.js");

module.exports = {
  ...common,
  key: "google_drive-find-folder",
  name: "Find Folder",
  description: "Search for a specific folder by name",
  version: "0.0.2",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to find a folder in",
    },
    folderName: {
      type: "string",
      label: "Name",
      description: "The name of the file to search for",
      optional: true,
      default: "",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const drive = this.googleDrive.drive();
    return (
      await drive.files.list({
        fields: "*",
        q: `mimeType = 'application/vnd.google-apps.folder' and name contains '${this.folderName}'`,
      })
    ).data.files;
  },
};
