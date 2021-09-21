const googleDrive = require('../../google_drive.app');
const common = require('../common.js');

module.exports = {
  ...common,
  key: 'google_drive-copy-file',
  name: 'Copy File',
  description: 'Create a copy of the specified file',
  version: '0.0.6',
  type: 'action',
  props: {
    googleDrive,
    drive: {
      propDefinition: [googleDrive, 'watchedDrive'],
      description: 'The drive containing the file to copy.',
    },
    fileId: {
      propDefinition: [
        googleDrive,
        'fileId',
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: 'The file to copy.',
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    return await this.googleDrive.copyFile(this.fileId);
  },
};
