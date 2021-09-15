const fs = require("fs");
const googleDrive = require("../../google_drive.app");
const common = require("../common.js");
const axios = require("axios");

module.exports = {
  ...common,
  key: "google_drive-replace-file",
  name: "Replace File",
  description: "Upload a file that replaces an existing file",
  version: "0.0.10",
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
    fileUrl: {
      type: "string",
      label: "File URL",
      description:
        "The URL of the file to attach. Must specify either File URL or File Path.",
      optional: true,
      default: "",
    },
    filePath: {
      type: "string",
      label: "File path",
      description:
        "The path to the file saved to the /tmp, e.g. /tmp/myFile.csv . Must specify either File URL or File Path.",
      optional: true,
      default: "",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    if (!this.fileUrl && !this.filePath) {
      throw new Error("One of File URL and File Path is required.");
    }
    const drive = this.googleDrive.drive();
    const file = this.fileUrl
      ? (
        await axios({
          url: this.fileUrl,
          method: "GET",
          responseType: "stream",
        })
      ).data
      : fs.createReadStream(this.filePath);
    return (
      await drive.files.update({
        fileId: this.fileId,
        media: {
          mimeType: this.filetype,
          uploadType: "media",
          body: file,
        },
      })
    ).data;
  },
};
