const googleDrive = require("../../google_drive.app");

module.exports = {
  key: "google_drive-delete-file",
  name: "Delete File",
  description:
    "Permanently delete a file or folder without moving it to the trash",
  version: "0.0.2",
  type: "action",
  props: {
    googleDrive,
    /* eslint-disable pipedream/default-value-required-for-optional-props */
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to find a file in",
      optional: true,
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileOrFolderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file or folder to delete",
    },
  },
  async run() {
    return await this.googleDrive.deleteFile(this.fileId);
  },
};
