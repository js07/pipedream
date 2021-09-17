const path = require("path");
const googleDrive = require("../../google_drive.app");
const common = require("../common.js");

const { GOOGLE_DRIVE_FOLDER_MIME_TYPE } = require("../../constants");
const { getFileStream } = require("../../utils");

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
      description: "The drive you want to replace a file in.",
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
          baseOpts: {
            q: `mimeType = '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}' and 'me' in writers`,
          },
        }),
      ],
      optional: false,
      description: "The file to update.",
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
        "The path to the file saved to the /tmp (e.g., `/tmp/myFile.csv`). Must specify either File URL or File Path.",
      optional: true,
      default: "",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The new name of the file (e.g., `myFile.csv`).",
      optional: true,
      default: "",
    },
    fileType: {
      type: "string",
      label: "File Type",
      description: "The new file MIME type, (e.g., `image/jpeg`).",
      optional: true,
      default: "",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const {
      fileId,
      fileUrl,
      filePath,
      fileName,
      fileType,
    } = this;
    if (!fileUrl && !filePath) {
      throw new Error("One of File URL and File Path is required.");
    }
    const drive = this.googleDrive.drive();
    // let file;
    // // let fileType = this.fileType || undefined;
    // if (this.fileUrl) {
    //   // const response = await axios({
    //   //   url: this.fileUrl,
    //   //   method: 'GET',
    //   //   responseType: 'stream',
    //   // });
    //   // fileType = response.headers['content-type'];
    //   // file = response.data;
    //   file = got.stream(fileUrl);
    // } else {
    //   file = fs.createReadStream(this.filePath);
    // }
    const file = getFileStream({
      fileUrl,
      filePath,
    });
    return (
      await drive.files.update({
        fileId,
        media: {
          mimeType: fileType || undefined,
          uploadType: "media",
          body: file,
        },
        requestBody: {
          name: fileName || path.basename(fileUrl || filePath),
        },
      })
    ).data;
  },
};
