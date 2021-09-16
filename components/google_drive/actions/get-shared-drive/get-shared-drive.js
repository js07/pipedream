const googleDrive = require("../../google_drive.app");
const common = require("../common.js");

module.exports = {
  ...common,
  key: "google_drive-get-shared-drive",
  name: "Get Shared Drive",
  description: "Get a shared drive's metadata by ID",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "Select a drive.",
    },
    useDomainAdminAccess: {
      type: "boolean",
      label: "Use Domain Admin Access",
      description: "Issue the request as a domain administrator.",
      optional: true,
      default: false,
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const drive = this.googleDrive.drive();
    return (
      await drive.drives.get({
        driveId: this.googleDrive.getDriveId(this.drive),
        useDomainAdminAccess: this.useDomainAdminAccess,
      })
    ).data;
  },
};
