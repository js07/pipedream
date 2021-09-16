const googleDrive = require("../../google_drive.app");
const common = require("../common.js");
const fs = require("fs");
const got = require("got");

module.exports = {
  ...common,
  key: "google_drive-update-file",
  name: "Update File",
  description: "Update a file's metadata and/or content",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to find a file in",
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file to update.",
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the file to use to update content.",
      optional: true,
      default: "",
    },
    filePath: {
      type: "string",
      label: "File Path",
      description:
        "The path to the file to saved to the /tmp, e.g. /tmp/myFile.csv to update content with.",
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
    addParents: {
      type: "string",
      label: "Add Parents",
      description: "A comma-separated list of parent folder IDs to add.",
      optional: true,
      default: "",
    },
    removeParents: {
      type: "string",
      label: "Remove Parents",
      description: "A comma-separated list of parent folder IDs to remove.",
      optional: true,
      default: "",
    },
    keepRevisionForever: {
      type: "boolean",
      label: "Keep Revision Forever",
      description:
        "Whether to set the 'keepForever' field in the new head revision.",
      optional: true,
      default: false,
    },
    ocrLanguage: {
      type: "string",
      label: "OCR Language",
      description:
        "A language hint for OCR processing during image import (ISO 639-1 code).",
      optional: true,
      default: "",
    },
    useContentAsIndexableText: {
      type: "boolean",
      label: "Use Content As Indexable Text",
      description: "Whether to use the uploaded content as indexable text.",
      optional: true,
      default: false,
    },
    advanced: {
      type: "object",
      label: "Advanced Options",
      optional: true,
      description:
        "Specify less-common properties that you require. See [Create a PaymentIntent]" +
        "https://developers.google.com/drive/api/v3/reference/files/update#request-body for a list of supported properties.",
      default: {},
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
      fileName = undefined,
      fileType = undefined,
      addParents,
      removeParents,
      keepRevisionForever,
      ocrLanguage,
      useContentAsIndexableText,
      advanced,
    } = this;
    // If fileUrl or filePath are used, get ReadStream for file
    let media = undefined;
    if (fileUrl) {
      media = {
        mimeType: fileType,
        body: got.stream(fileUrl),
      };
    } else if (filePath) {
      media = {
        mimeType: fileType,
        body: fs.createReadStream(filePath),
      };
    }
    const drive = this.googleDrive.drive();
    return (
      await drive.files.update({
        fileId,
        media,
        addParents,
        removeParents,
        keepRevisionForever,
        ocrLanguage,
        useContentAsIndexableText,
        requestBody: {
          name: fileName,
          mimeType: fileType,
          ...advanced,
        },
      })
    ).data;
  },
};
