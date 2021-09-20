const googleDrive = require("../../google_drive.app");
const common = require("../common.js");

module.exports = {
  ...common,
  key: "google_drive-create-folder",
  name: "Create Folder",
  description: "Create a new empty folder",
  version: "0.0.11",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to create the folder in.",
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
      description: "The folder you want to create the folder in.",
      optional: true,
      default: "",
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      label: "Name",
      description: "The name of the new folder.",
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
      name = undefined,
    } = this;
    // const drive = this.googleDrive.drive();
    // return (
    //   await drive.files.create({
    //     fields: "*",
    //     requestBody: {
    //       mimeType: "application/vnd.google-apps.folder",
    //       name: name,
    //       parents: parentId
    //         ? [
    //           parentId,
    //         ]
    //         : undefined,
    //     },
    //   })
    // ).data;
    return await this.googleDrive.createFolder({
      name,
      parentId,
    });
  },
};
