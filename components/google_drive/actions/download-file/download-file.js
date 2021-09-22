const googleDrive = require("../../google_drive.app");
const fs = require("fs");
const stream = require("stream");
const { promisify } = require("util");
const { GOOGLE_DRIVE_MIME_TYPE_PREFIX } = require("../../constants");

/**
 * Uses Google Drive API to download files to a `filePath` in the /tmp
 * directory.
 *
 * Use `files.export` for Google Workspace files types (e.g.,
 * `application/vnd.google-apps.document`) and `files.get` for other file types,
 * as per the [Download files API guide](https://bit.ly/2ZbJvcn).
 */
module.exports = {
  key: "google_drive-download-file",
  name: "Download File",
  description: "Download a file",
  version: "0.0.8",
  type: "action",
  props: {
    googleDrive,
    /* eslint-disable pipedream/default-value-required-for-optional-props */
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive containing the file to download",
      optional: true,
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file to download",
    },
    filePath: {
      type: "string",
      label: "Destination File Path",
      description:
        "The destination path for the file in /tmp (e.g., `/tmp/myFile.csv`).",
    },
  },
  async run() {
    // Get file metadata to get mime type
    const drive = this.googleDrive.drive();
    // Get file mimeType
    const fileMetadata = await this.googleDrive.getFile(this.fileId, {
      fields: "mimeType",
    });
    const mimeType = fileMetadata.mimeType;
    // Download file
    let file;
    if (mimeType.includes(GOOGLE_DRIVE_MIME_TYPE_PREFIX)) {
      // `mimeType` is a Google MIME type
      // See https://developers.google.com/drive/api/v3/mime-types for a list of
      // Google MIME types.
      // Converting Google Workspace formats to `application/pdf` because it is
      // supported for all Google Workspace formats other than Apps Scripts
      // See https://developers.google.com/drive/api/v3/ref-export-formats for
      // more information.
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
