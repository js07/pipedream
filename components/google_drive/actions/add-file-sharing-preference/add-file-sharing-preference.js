const googleDrive = require("../../google_drive.app");
const common = require("../common.js");

module.exports = {
  ...common,
  key: "google_drive-add-file-sharing-preference",
  name: "Add File Sharing Preference",
  description: "Add File Sharing Preference",
  version: "0.0.11",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to find a file in",
      optional: true,
      default: "",
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
          baseOpts: {
            q: "'me' in owners",
          },
        }),
      ],
      optional: false,
      description: "The file to add a file sharing preference to.",
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role granted by this permission.",
      optional: true,
      default: "reader",
      options: [
        "owner",
        "organizer",
        "fileOrganizer",
        "writer",
        "commenter",
        "reader",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the grantee.",
      optional: true,
      default: "anyone",
      options: [
        "user",
        "group",
        "domain",
        "anyone",
      ],
    },
    domain: {
      type: "string",
      label: "Domain",
      description:
        "The domain to which this permission refers if type is 'domain'.",
      optional: true,
      default: "",
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description:
        "The email address of the user or group to which this permission refers if type is 'user' or 'group'.",
      optional: true,
      default: "",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const drive = this.googleDrive.drive();
    await drive.permissions.create({
      fileId: this.fileId,
      requestBody: {
        role: this.role,
        type: this.type,
        domain: this.domain || undefined,
        emailAddress: this.emailAddress || undefined,
      },
    });

    return (await this.googleDrive.getFile(this.fileId)).webViewLink;
  },
};
