const googleDrive = require("../../google_drive.app");
const common = require("../common.js");

module.exports = {
  ...common,
  key: "google_drive-create-folder",
  name: "Create Folder",
  description: "Create a new empty folder",
  version: "0.0.10",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to create the folder in",
    },
    folder: {
      propDefinition: [
        googleDrive,
        "folder",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The folder you want to create the folder in",
      optional: true,
      default: "",
    },
    folderName: {
      type: "string",
      label: "Name",
      description: "The name of the new folder",
      optional: true,
      default: "",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const {
      folder,
      folderName = undefined,
    } = this;
    const drive = this.googleDrive.drive();
    return (
      await drive.files.create({
        fields: "*",
        requestBody: {
          mimeType: "application/vnd.google-apps.folder",
          name: folderName,
          parents: folder
            ? [
              folder,
            ]
            : undefined,
        },
      })
    ).data;
  },
};
