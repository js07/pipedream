const googleDrive = require("../../google_drive.app");
const common = require("../common.js");

module.exports = {
  ...common,
  key: "google_drive-get-folder-id-for-path",
  name: "Get Folder ID for a Path",
  description: "Retrieve a folderId for a path",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive containing the folder.",
      optional: true,
      default: "",
    },
    path: {
      type: "string",
      label: "Path",
      description:
        "The path to the folder (e.g., `myFolder/mySubFolder1/mySubFolder2`).",
      optional: false,
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    // For each part of path, find folder with folderId of parent folder in
    // `parents`.
    // Return folderId of last folder.
    const parts = this.path.split("/");

    let part;
    let parentId;
    while ((part = parts.shift())) {
      const folders = await this.googleDrive.findFolder({
        drive: this.drive,
        name: part,
        parentId,
      });
      parentId = folders[0] && folders[0].id;
    }

    return parentId;
  },
};
