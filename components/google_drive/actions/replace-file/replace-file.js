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
  version: "0.0.42",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to replace a file in.",
      optional: true,
      default: "",
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
      description: "The file to update.",
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
      description: "The new name of the file (e.g., `myFile.csv`).",
    },
    mimeType: {
      propDefinition: [
        googleDrive,
        "mimeType",
      ],
      description: "The new file's MIME type, (e.g., `image/jpeg`).",
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
      name,
      mimeType,
    } = this;
    if (!fileUrl && !filePath) {
      throw new Error("One of File URL and File Path is required.");
    }
    // const drive = this.googleDrive.drive();
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
    const file = await getFileStream({
      fileUrl,
      filePath,
    });
    // return (
    //   await drive.files.update({
    //     fileId,
    //     media: {
    //       mimeType: mimeType || undefined,
    //       uploadType: "media",
    //       body: file,
    //     },
    //     requestBody: {
    //       name: name || path.basename(fileUrl || filePath),
    //     },
    //   })
    // ).data;
    return await this.googleDrive.updateFile(fileId, {
      name: name || path.basename(fileUrl || filePath),
      file,
      mimeType: mimeType || undefined,
    });
  },
};
