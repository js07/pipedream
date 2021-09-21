const googleDrive = require('../../google_drive.app');
const common = require('../common.js');

module.exports = {
  ...common,
  key: 'google_drive-delete-shared-drive',
  name: 'Delete Shared Drive',
  description: 'Delete a shared drive without any content',
  version: '0.0.2',
  type: 'action',
  props: {
    googleDrive,
    drive: {
      propDefinition: [googleDrive, 'watchedDrive'],
      description: 'Select a drive to delete.',
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    return await this.googleDrive.deleteSharedDrive(
      this.googleDrive.getDriveId(this.drive)
    );
  },
};
