const googleDrive = require('../../google_drive.app');
const common = require('../common.js');

module.exports = {
  ...common,
  key: 'google_drive-update-shared-drive',
  name: 'Update Shared Drive',
  description: 'Update an existing shared drive',
  version: '0.0.2',
  type: 'action',
  props: {
    googleDrive,
    drive: {
      propDefinition: [googleDrive, 'watchedDrive'],
      description: 'Select a drive to update.',
    },
    useDomainAdminAccess: {
      propDefinition: [googleDrive, 'useDomainAdminAccess'],
    },
    backgroundImageLink: {
      type: 'string',
      label: 'Background Image Link',
      description:
        'A link to the newbackround image for the shared drive. Cannot be set if `themeId` is set in the same request.',
      optional: true,
      default: '',
    },
    colorRgb: {
      type: 'string',
      label: 'Color',
      description:
        'The new color of this shared drive as an RGB hex string. Cannot be set if `themeId` is set in the same request.',
      optional: true,
      default: '',
    },
    themeId: {
      type: 'string',
      label: 'Theme ID',
      description:
        'The ID of the theme from which the background image and color will be set. Cannot be set if `colorRgb` or `backgroundImageFile` is set in the same request.',
      optional: true,
      default: '',
    },
    restrictions: {
      type: 'object',
      label: 'Restrictions',
      description:
        'A set of restrictions that apply to this shared drive or items inside this shared drive. See `restrictions` in the [Drive resource representation](https://developers.google.com/drive/api/v3/reference/drives#resource-representations).',
      optional: true,
      default: {},
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const {
      useDomainAdminAccess,
      backgroundImageLink = undefined,
      colorRgb = undefined,
      themeId = undefined,
      restrictions,
    } = this;
    return await this.googleDrive.updateSharedDrive(this.driveId, {
      useDomainAdminAccess,
      requestBody: {
        backgroundImageLink,
        colorRgb,
        themeId,
        restrictions,
      },
    });
  },
};
