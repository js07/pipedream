const googleDrive = require("../../google_drive.app");
const { getListFilesOpts } = require("../../utils");
const common = require("../common.js");

module.exports = {
  ...common,
  key: "google_drive-find-file",
  name: "Find File",
  description: "Search for a specific file by name",
  version: "0.0.8",
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
    nameSearchTerm: {
      propDefinition: [
        googleDrive,
        "fileNameSearchTerm",
      ],
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const drive = this.googleDrive.drive();
    const opts = getListFilesOpts(this.drive || undefined, {
      q: `name contains '${this.nameSearchTerm}'`,
    });
    console.log("opts", opts);
    return (await drive.files.list(opts)).data;
    // return (await this.googleDrive.listFilesInPage(null, opts)).files;
  },
};
