const googleDrive = require("../../google_drive.app");
const { getFileStream } = require("../../utils");
const common = require("../common.js");
const isoLanguages = require("../language-codes.js");

module.exports = {
  ...common,
  key: "google_drive-update-file",
  name: "Update File",
  description: "Update a file's metadata and/or content",
  version: "0.0.2",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to find a file in.",
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
      description: "The file to update.",
    },
    fileUrl: {
      propDefinition: [
        googleDrive,
        "fileUrl",
      ],
      description: "The URL of the file to use to update content.",
    },
    filePath: {
      propDefinition: [
        googleDrive,
        "filePath",
      ],
      description:
        "The path to the file to saved to the /tmp, e.g. /tmp/myFile.csv to update content with.",
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      description: "The new name of the file.",
    },
    mimeType: {
      propDefinition: [
        googleDrive,
        "mimeType",
      ],
      description: "The new file MIME type, e.g. image/jpeg .",
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
      options: isoLanguages,
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
      name = undefined,
      mimeType = undefined,
      addParents,
      removeParents,
      keepRevisionForever,
      ocrLanguage,
      useContentAsIndexableText,
      advanced,
    } = this;
    // If fileUrl or filePath is used, get ReadStream for file
    // const media =
    //   fileUrl || filePath
    //     ? {
    //       mimeType,
    //       body: await getFileStream({
    //         fileUrl,
    //         filePath,
    //       }),
    //     }
    //     : undefined;
    const file =
      fileUrl || filePath
        ? await getFileStream({
          fileUrl,
          filePath,
        })
        : undefined;
    // const drive = this.googleDrive.drive();
    // return (
    //   await drive.files.update({
    //     fileId,
    //     media,
    //     addParents,
    //     removeParents,
    //     keepRevisionForever,
    //     ocrLanguage,
    //     useContentAsIndexableText,
    //     requestBody: {
    //       name: name,
    //       mimeType: mimeType,
    //       ...advanced,
    //     },
    //   })
    // ).data;

    return await this.googleDrive.update(fileId, {
      name,
      file,
      mimeType,
      addParents,
      removeParents,
      keepRevisionForever,
      ocrLanguage,
      useContentAsIndexableText,
      requestBody: {
        ...advanced,
      },
    });
  },
};
