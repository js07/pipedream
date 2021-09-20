const googleDrive = require("../../google_drive.app");
const common = require("../common.js");

module.exports = {
  ...common,
  key: "google_drive-copy-file",
  name: "Copy File",
  description: "Create a copy of the specified file",
  version: "0.0.4",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive containing the file to copy.",
      optional: true,
      default: "",
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file to copy.",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    // const drive = this.googleDrive.drive();
    // return (
    //   await drive.files.copy({
    //     fields: "*",
    //     fileId: this.fileId,
    //   })
    // ).data;

    return await this.googleDrive.copyFile(this.fileId);
  },
};
