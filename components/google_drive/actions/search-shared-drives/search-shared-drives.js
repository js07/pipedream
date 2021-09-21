const googleDrive = require("../../google_drive.app");
const common = require("../common.js");

module.exports = {
  ...common,
  key: "google_drive-search-shared-drives",
  name: "Search for Shared Drives",
  description: "Search for shared drives with query options",
  version: "0.0.2",
  type: "action",
  props: {
    googleDrive,
    query: {
      type: "string",
      label: "Search Query",
      description:
        "The shared drives search query. See [query terms](https://developers.google.com/drive/api/v3/ref-search-terms?authuser=2#drive_properties).",
    },
    useDomainAdminAccess: {
      propDefinition: [
        googleDrive,
        "useDomainAdminAccess",
      ],
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    // const drive = this.googleDrive.drive();
    // return (
    //   await drive.drives.list({
    //     q: this.query,
    //     useDomainAdminAccess: this.useDomainAdminAccess,
    //   })
    // ).data;
    return (
      await this.googleDrive.searchDrives({
        q: this.query,
        useDomainAdminAccess: this.useDomainAdminAccess,
      })
    ).drives;
  },
};
