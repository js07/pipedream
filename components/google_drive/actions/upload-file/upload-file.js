const googleDrive = require("../../google_drive.app");
const common = require("../common.js");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports = {
  ...common,
  key: "google_drive-upload-file",
  name: "Upload File",
  description: "Copy an existing file to Google Drive",
  version: "0.0.3",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to upload the file to",
    },
    folder: {
      propDefinition: [
        googleDrive,
        "folder",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The folder you want to upload the file to",
      optional: true,
      default: "",
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description:
        "The URL of the file to upload. Must specify either File URL or File Path.",
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
      label: "Name",
      description: "The name of the new file",
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
      await drive.files.create({
        media: {
          mimeType: fileType,
          body: file,
        },
        requestBody: {
          name: this.fileName || path.basename(this.fileUrl || this.filePath),
        },
      })
    ).data;
  },
};
