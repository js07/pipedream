const googleDrive = require("../../google_drive.app");
const { getListFilesOpts } = require("../../utils");
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
      description: "The drive you want to find a folder in.",
      optional: true,
      default: "",
    },
    folderName: {
      type: "string",
      label: "Search Name",
      description: "The name of the folder to search for.",
      optional: true,
      default: "",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const drive = this.googleDrive.drive();
    const opts = getListFilesOpts(this.drive, {
      q: `mimeType = 'application/vnd.google-apps.folder' and name contains '${this.folderName}'`,
    });
    return (await drive.files.list(opts)).data.files;
  },
};
