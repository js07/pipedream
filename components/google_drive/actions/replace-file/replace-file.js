const path = require("path");
const googleDrive = require("../../google_drive.app");

const { GOOGLE_DRIVE_FOLDER_MIME_TYPE } = require("../../constants");
const { getFileStream } = require("../../utils");

module.exports = {
  key: "google_drive-replace-file",
  name: "Replace File",
  description: "Upload a file that replaces an existing file",
  version: "0.0.62",
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
        "fileId",
        (c) => ({
          drive: c.drive,
          baseOpts: {
            q: `mimeType != '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}' and 'me' in writers`,
          },
        }),
      ],
      optional: false,
      description: "The file to update",
    },
    fileUrl: {
      propDefinition: [
        googleDrive,
        "fileUrl",
      ],
      description:
        "The URL of the file to attach. Must specify either File URL or File Path.",
    },
    filePath: {
      propDefinition: [
        googleDrive,
        "filePath",
      ],
      description:
        "The path to the file saved to the /tmp (e.g., `/tmp/myFile.csv`). Must specify either File URL or File Path.",
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      label: "Name",
      description: "The name of the new file (e.g., `myFile.csv`)",
    },
    mimeType: {
      propDefinition: [
        googleDrive,
        "mimeType",
      ],
      description: "The MIME type of the new file (e.g., `image/jpeg`)",
    },
  },
  async run() {
    const {
      fileId,
      fileUrl,
      filePath,
      name,
      mimeType,
    } = this;
    if (!fileUrl && !filePath) {
      throw new Error("One of File URL and File Path is required.");
    }
    const fileStream = await getFileStream({
      fileUrl,
      filePath,
    });
    // Update file media separately from metadata to prevent multipart upload,
    // which `google-apis-nodejs-client` doesn't seem to support for
    // [files.update](https://bit.ly/3lP5sWn)
    await this.googleDrive.updateFileMedia(fileId, fileStream, {
      mimeType: mimeType || undefined,
    });
    return await this.googleDrive.updateFile(fileId, {
      name: name || path.basename(fileUrl || filePath),
      mimeType,
    });
  },
};
