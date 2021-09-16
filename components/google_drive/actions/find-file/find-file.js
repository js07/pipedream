const googleDrive = require("../../google_drive.app");
const { getListFilesOpts } = require("../../utils");
const common = require("../common.js");

module.exports = {
  ...common,
  key: "google_drive-find-file",
  name: "Find File",
  description: "Search for a specific file by name",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to find a file in.",
      optional: true,
      default: "",
    },
    fileName: {
      type: "string",
      label: "Search Name",
      description: "The name of the file to search for.",
      optional: true,
      default: "",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const drive = this.googleDrive.drive();
    const opts = getListFilesOpts(this.drive || undefined, {
      q: `mimeType != 'application/vnd.google-apps.folder' and name contains '${this.fileName}'`,
    });
    return (await drive.files.list(opts)).data.files;
  },
};
