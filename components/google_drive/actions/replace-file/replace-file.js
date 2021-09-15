const fs = require("fs");
const googleDrive = require("../../google_drive.app");
const common = require("../common.js");
const axios = require("axios");
const path = require("path");

module.exports = {
  ...common,
  key: "google_drive-replace-file",
  name: "Replace File",
  description: "Upload a file that replaces an existing file",
  version: "0.0.18",
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
        const baseOpts = {
          q: "'me' in writers",
        };
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
      label: "File Path",
      description:
        "The path to the file saved to the /tmp, e.g. /tmp/myFile.csv . Must specify either File URL or File Path.",
      optional: true,
      default: "",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The new name of the file.",
      optional: true,
      default: "",
    },
    fileType: {
      type: "string",
      label: "File Type",
      description: "The new file MIME type, e.g. image/jpeg .",
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
    let file;
    let fileType = this.fileType || undefined;
    if (this.fileUrl) {
      const response = await axios({
        url: this.fileUrl,
        method: "GET",
        responseType: "stream",
      });
      fileType = response.headers["content-type"];
      file = response.data;
    } else {
      file = fs.createReadStream(this.filePath);
    }
    return (
      await drive.files.update({
        fileId: this.fileId,
        media: {
          mimeType: fileType,
          uploadType: "media",
          body: file,
        },
        requestBody: {
          name: this.fileName || path.basename(this.fileUrl || this.filePath),
        },
      })
    ).data;
  },
};
