const googleDrive = require("../../google_drive.app");

module.exports = {
  key: "google_drive-move-file-to-trash",
  name: "Move File to Trash",
  description: "Move a file or folder to trash",
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
      description:
        "The drive to use. If not specified, your personal Google Drive will be used. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
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
      description: "The file or folder to move to trash",
    },
  },
  async run() {
    return await this.googleDrive.updateFile(this.fileId, {
      requestBody: {
        trashed: true,
      },
    });
  },
};
