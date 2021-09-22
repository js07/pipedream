const googleDrive = require("../../google_drive.app");

module.exports = {
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
        "The [shared drives](https://support.google.com/a/users/answer/9310351) search query. See [query terms](https://developers.google.com/drive/api/v3/ref-search-terms#drive_properties) for a list of shard drive-specific query terms.",
    },
    useDomainAdminAccess: {
      propDefinition: [
        googleDrive,
        "useDomainAdminAccess",
      ],
    },
  },
  async run() {
    return (
      await this.googleDrive.searchDrives({
        q: this.query,
        useDomainAdminAccess: this.useDomainAdminAccess,
      })
    ).drives;
  },
};
