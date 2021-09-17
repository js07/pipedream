const googleDrive = require("../../google_drive.app");
const common = require("../common.js");
const path = require("path");
const { getFileStream } = require("../../utils");

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
      description: "The drive you want to upload the file to.",
    },
    folderId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The folder you want to upload the file to.",
      optional: true,
      default: "",
    },
    fileUrl: {
      propDefinition: [
        googleDrive,
        "fileUrl",
      ],
      description:
        "The URL of the file to upload. Must specify either File URL or File Path.",
    },
    filePath: {
      propDefinition: [
        googleDrive,
        "filePath",
      ],
      description:
        "The path to the file saved to the /tmp (e.g. `/tmp/myFile.csv`). Must specify either File URL or File Path.",
    },
    fileName: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      description: "The name of the new file (e.g. `/myFile.csv`).",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const {
      folderId,
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
    // let fileType = this.fileType || undefined;
    // if (this.fileUrl) {
    //   const response = await axios({
    //     url: this.fileUrl,
    //     method: 'GET',
    //     responseType: 'stream',
    //   });
    //   fileType = response.headers['content-type'];
    //   file = response.data;
    // } else {
    //   file = fs.createReadStream(this.filePath);
    // }
    const file = getFileStream({
      fileUrl,
      filePath,
    });
    return (
      await drive.files.create({
        media: {
          mimeType: fileType || undefined,
          body: file,
        },
        requestBody: {
          name: fileName || path.basename(fileUrl || filePath),
          parents: folderId
            ? [
              folderId,
            ]
            : undefined,
        },
      })
    ).data;
  },
};
