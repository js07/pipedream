const googleDrive = require("../../google_drive.app");
const common = require("../common.js");
// const { v4: uuid } = require("uuid");

module.exports = {
  ...common,
  key: "google_drive-create-shared-drive",
  name: "Create Shared Drive",
  description: "Create Shared Drive",
  version: "0.0.2",
  type: "action",
  props: {
    googleDrive,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new shared drive.",
      optional: true,
      default: "",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    // const drive = this.googleDrive.drive();
    // return (
    //   await drive.drives.create({
    //     requestId: uuid(),
    //     requestBody: {
    //       name: this.name,
    //     },
    //   })
    // ).data;
    return await this.googleDrive.createDrive({
      name: this.name,
    });
  },
};
