const googleDrive = require("../google_drive.app.js");

module.exports = {
  methods: {
    isMyDrive(drive = this.drive) {
      return googleDrive.methods.isMyDrive(drive);
    },
    getDriveId(drive = this.drive) {
      return googleDrive.methods.getDriveId(drive);
    },
  },
};
