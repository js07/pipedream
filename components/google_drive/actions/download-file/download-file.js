const googleDrive = require("../../google_drive.app");
const common = require("../common.js");
const fs = require("fs");
const stream = require("stream");
const { promisify } = require("util");
const { GOOGLE_DRIVE_MIME_TYPE_PREFIX } = require("../../constants");

module.exports = {
  ...common,
  key: "google_drive-download-file",
  name: "Download File",
  description: "Download a file",
  version: "0.0.8",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive containing the file to download.",
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
      description: "The file to download.",
    },
    filePath: {
      type: "string",
      label: "Destination File Path",
      description:
        "The destination path for the file in /tmp (e.g., `/tmp/myFile.csv`).",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    // Get file metadata to get mime type
    // Use .export for google file types, .get other
    const drive = this.googleDrive.drive();
    // Get file mimeType
    // const fileMetadata = (
    //   await drive.files.get({
    //     fileId: this.fileId,
    //     fields: "mimeType",
    //   })
    // ).data;
    const fileMetadata = await this.googleDrive.getFile(this.fileId, {
      fields: "mimeType",
    });
    const mimeType = fileMetadata.mimeType;
    // Download
    let file;
    if (mimeType.includes(GOOGLE_DRIVE_MIME_TYPE_PREFIX)) {
      // Google MIME type
      // See https://developers.google.com/drive/api/v3/mime-types for a list of
      // Google MIME types.
      file = (
        await drive.files.export(
          {
            fileId: this.fileId,
            mimeType: "application/pdf",
          },
          {
            responseType: "stream",
          },
        )
      ).data;
    } else {
      file = (
        await drive.files.get(
          {
            fileId: this.fileId,
            alt: "media",
          },
          {
            responseType: "stream",
          },
        )
      ).data;
    }
    const pipeline = promisify(stream.pipeline);
    await pipeline(file, fs.createWriteStream(this.filePath));
    return fileMetadata;
  },
};
