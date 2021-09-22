const googleDrive = require("../../google_drive.app");

module.exports = {
  key: "google_drive-create-folder",
  name: "Create Folder",
  description: "Create a new empty folder",
  version: "0.0.12",
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
    /* eslint-disable pipedream/default-value-required-for-optional-props */
    parentId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description:
        "Select a folder in which to place the new folder. If not specified, the folder will be placed directly in the user's My Drive folder.",
      optional: true,
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      label: "Name",
      description: "The name of the new folder",
      optional: true,
    },
  },
  async run() {
    const {
      parentId,
      name,
    } = this;
    return await this.googleDrive.createFolder({
      name,
      parentId,
    });
  },
};
