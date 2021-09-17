const googleDrive = require("../../google_drive.app");
const common = require("../common.js");

module.exports = {
  ...common,
  key: "google_drive-move-file",
  name: "Move File",
  description: "Move a file from one folder to another",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive containing the file to move.",
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
      description: "The file to move.",
    },
    folderId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The folder you want to move the file to.",
      optional: true,
      default: "",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    // Find file
    // Update file, removing old parents, adding new parent (folder)
    const drive = this.googleDrive.drive();
    const file = await this.googleDrive.getFile(this.fileId);
    return (
      await drive.files.update({
        fileId: this.fileId,
        fields: "*",
        removeParents: file.parents.join(","),
        addParents: this.folderId,
      })
    ).data;
  },
};
