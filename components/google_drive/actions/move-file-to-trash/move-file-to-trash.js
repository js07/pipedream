const googleDrive = require("../../google_drive.app");
const common = require("../common.js");

module.exports = {
  ...common,
  key: "google_drive-move-file-to-trash",
  name: "Move File to Trash",
  description: "Move a file or folder to trash",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to find a file or folder in.",
    },
    fileOrFolderId: {
      propDefinition: [
        googleDrive,
        "fileOrFolderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file or folder to move to trash.",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const drive = this.googleDrive.drive();
    return (
      await drive.files.update({
        fileId: this.fileId,
        requestBody: {
          trashed: true,
        },
      })
    ).data;
  },
};
