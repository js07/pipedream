const googleDrive = require("../../google_drive.app");
const common = require("../common.js");
const { Readable } = require("stream");

module.exports = {
  ...common,
  key: "google_drive-create-file-from-text",
  name: "Create New File From Text ",
  description: "Create a new file from plain text",
  version: "0.0.3",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to create a file in.",
      optional: true,
      default: "",
    },
    parentId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The folder you want to add the file to.",
      optional: true,
      default: "",
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      description:
        "The name of the file you want to create (e.g., `myFile.txt`)",
      default: "",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The plain text of the new file.",
      optional: true,
      default: "",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const {
      parentId,
      name,
      content,
    } = this;
    const drive = this.googleDrive.drive();
    const file = Readable.from([
      content,
    ]);
    return (
      await drive.files.create({
        media: {
          mimeType: "text/plain",
          body: file,
        },
        requestBody: {
          name,
          parents: parentId
            ? [
              parentId,
            ]
            : undefined,
        },
      })
    ).data;
  },
};
