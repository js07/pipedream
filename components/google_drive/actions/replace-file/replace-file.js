const fs = require("fs");
const googleDrive = require("../../google_drive.app");
const common = require("../common.js");

module.exports = {
  ...common,
  key: "google_drive-replace-file",
  name: "Replace File",
  description: "Upload a file that replaces an existing file",
  version: "0.0.5",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to replace a file in",
    },
    fileId: {
      type: "string",
      label: "File",
      description: "The file to replace.",
      optional: false,
      options({ prevContext }) {
        const { nextPageToken } = prevContext;
        const baseOpts = {};
        const opts = this.isMyDrive()
          ? baseOpts
          : {
            ...baseOpts,
            corpora: "drive",
            driveId: this.getDriveId(),
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
          };
        return this.googleDrive.listFilesOptions(nextPageToken, opts);
      },
    },
    pathToFile: {
      type: "string",
      label: "File path",
      description:
        "The path to the file saved to the /tmp, e.g. /tmp/myFile.csv .",
      optional: false,
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
        media: {
          mimeType: this.filetype,
          uploadType: "media",
          body: fs.createReadStream(this.pathToFile),
        },
      })
    ).data;
  },
};
