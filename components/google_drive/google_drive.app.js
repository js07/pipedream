const axios = require("axios");
const { google } = require("googleapis");
const { uuid } = require("uuidv4");
// const { v4: uuidv4 } = require("uuid");
const mimeDb = require("mime-db");
const mimeTypes = Object.keys(mimeDb);

const {
  GOOGLE_DRIVE_UPDATE_TYPES,
  MY_DRIVE_VALUE,
  WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS,
  GOOGLE_DRIVE_FOLDER_MIME_TYPE,
} = require("./constants");
const googleMimeTypes = require("./actions/google-mime-types");

const {
  isMyDrive,
  getDriveId,
  getListFilesOpts,
} = require("./utils");

module.exports = {
  type: "app",
  app: "google_drive",
  propDefinitions: {
    watchedDrive: {
      type: "string",
      label: "Drive",
      description: "The drive you want to watch for changes,",
      async options({ prevContext }) {
        const { nextPageToken } = prevContext;
        return this._listDriveOptions(nextPageToken);
      },
    },
    folderId: {
      type: "string",
      label: "Folder",
      description: "The folder in the drive.",
      options({
        prevContext,
        drive,
        baseOpts = {
          q: `mimeType = '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}'`,
        },
      }) {
        const { nextPageToken } = prevContext;
        return this.listDriveFilesOptions(drive, nextPageToken, baseOpts);
      },
    },
    fileId: {
      type: "string",
      label: "File",
      description: "The file in the drive.",
      options({
        prevContext,
        drive,
        baseOpts = {
          q: `mimeType != '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}'`,
        },
      }) {
        const { nextPageToken } = prevContext;
        return this.listDriveFilesOptions(drive, nextPageToken, baseOpts);
      },
    },
    fileOrFolderId: {
      type: "string",
      label: "File or Folder",
      description: "The file or folder in the drive.",
      options({
        prevContext, drive, baseOpts = {},
      }) {
        const { nextPageToken } = prevContext;
        return this.listDriveFilesOptions(drive, nextPageToken, baseOpts);
      },
    },
    updateTypes: {
      type: "string[]",
      label: "Types of updates",
      description:
        "The types of updates you want to watch for on these files. [See Google's docs](https://developers.google.com/drive/api/v3/push#understanding-drive-api-notification-events).",
      // https://developers.google.com/drive/api/v3/push#understanding-drive-api-notification-events
      default: GOOGLE_DRIVE_UPDATE_TYPES,
      options: GOOGLE_DRIVE_UPDATE_TYPES,
    },
    watchForPropertiesChanges: {
      type: "boolean",
      label: "Watch for changes to file properties",
      description:
        "Watch for changes to [file properties](https://developers.google.com/drive/api/v3/properties) in addition to changes to content. **Defaults to `false`, watching for only changes to content**.",
      optional: true,
      default: false,
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the file to upload.",
      optional: true,
      default: "",
    },
    filePath: {
      type: "string",
      label: "File Path",
      description:
        "The path to the file saved to the /tmp (e.g. `/tmp/myFile.csv`).",
      optional: true,
      default: "",
    },
    fileName: {
      type: "string",
      label: "Name",
      description: "The new name of the file (e.g. `/myFile.csv`).",
      optional: true,
      default: "",
    },
    fileNameSearchTerm: {
      type: "string",
      label: "Search Name",
      description: "The name of the file to search for.",
      optional: true,
      default: "",
    },
    mimeType: {
      type: "string",
      label: "MIME Type",
      description: "The file's MIME type, (e.g., `image/jpeg`).",
      optional: true,
      default: "",
      async options({ page = 0 }) {
        const allTypes = googleMimeTypes.concat(mimeTypes);
        const start = (page - 1) * 10;
        const end = start + 10;
        return allTypes.slice(start, end);
      },
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
    // Static methods
    isMyDrive,
    getDriveId,

    // Returns a drive object authenticated with the user's access token
    drive() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return google.drive({
        version: "v3",
        auth,
      });
    },
    // Google's push notifications provide a URL to the resource that changed,
    // which we can use to fetch the file's metadata. So we use axios here
    // (vs. the Node client) to get that.
    async getFileMetadata(url) {
      return (
        await axios({
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          },
          url,
        })
      ).data;
    },
    /**
     * This method yields a list of changes that occurred to files in a
     * particular Google Drive. It is a wrapper around [the `drive.changes.list`
     * API](https://bit.ly/2SGb5M2) but defined as a generator to enable lazy
     * loading of multiple pages.
     *
     * @typedef {object} ChangesPage
     * @property {object[]} changedFiles - the list of file changes, as [defined
     * by the API](https://bit.ly/3h7WeUa). This list filters out any result
     * that is not a proper object.
     * @property {string} nextPageToken - the page token [returned by the last API
     * call](https://bit.ly/3h7WeUa). **Note that this generator keeps track of
     * this token internally, and the purpose of this value is to provide a way
     * for consumers of this method to handle checkpoints in case of an
     * unexpected halt.**
     *
     * @param {string} [pageToken] - the token for continuing a previous list
     * request on the next page. This must be a token that was previously
     * returned by this same method.
     * @param {string} [driveId]  - the shared drive from which changes are
     * returned
     * @yields
     * @type {ChangesPage}
     */
    async *listChanges(pageToken, driveId) {
      const drive = this.drive();
      let changeRequest = {
        pageToken,
        pageSize: 1000,
      };

      // As with many of the methods for Google Drive, we must
      // pass a request of a different shape when we're requesting
      // changes for My Drive (null driveId) vs. a shared drive
      if (driveId) {
        changeRequest = {
          ...changeRequest,
          driveId,
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        };
      }

      while (true) {
        const { data } = await drive.changes.list(changeRequest);
        const {
          changes = [],
          newStartPageToken,
          nextPageToken,
        } = data;

        // Some changes do not include an associated file object. Return only
        // those that do
        const changedFiles = changes
          .map((change) => change.file)
          .filter((f) => typeof f === "object");

        yield {
          changedFiles,
          nextPageToken: nextPageToken || newStartPageToken,
        };

        if (newStartPageToken) {
          // The 'newStartPageToken' field is only returned as part of the last
          // page from the API response: https://bit.ly/3jBEvWV
          break;
        }

        changeRequest.pageToken = nextPageToken;
      }
    },
    async getPageToken(driveId) {
      const drive = this.drive();
      const request = driveId
        ? {
          driveId,
          supportsAllDrives: true,
        }
        : {};
      const { data } = await drive.changes.getStartPageToken(request);
      return data.startPageToken;
    },
    checkHeaders(headers, subscription, channelID) {
      if (
        !headers["x-goog-resource-state"] ||
        !headers["x-goog-resource-id"] ||
        !headers["x-goog-resource-uri"] ||
        !headers["x-goog-message-number"]
      ) {
        console.log("Request missing necessary headers: ", headers);
        return false;
      }

      const incomingChannelID = headers["x-goog-channel-id"];
      if (incomingChannelID !== channelID) {
        console.log(
          `Channel ID of ${incomingChannelID} not equal to deployed component channel of ${channelID}`,
        );
        return false;
      }

      if (headers["x-goog-resource-id"] !== subscription.resourceId) {
        console.log(
          `Resource ID of ${subscription.resourceId} not currently being tracked. Exiting`,
        );
        return false;
      }
      return true;
    },
    /**
     * A utility method around [the `drive.drives.list`
     * API](https://bit.ly/3AiWE1x) but scoped to a specific page of the API
     * response
     *
     * @typedef {object} DriveListPage - an object representing a page that
     * lists GDrive drives, as defined by [the API](https://bit.ly/3jwxbvy)
     *
     * @param {string} [pageToken] - the page token for the next page of shared
     * drives
     * @param {number} [pageSize=10] - the number of records to retrieve as part
     * of the page
     *
     * @returns
     * @type {DriveListPage}
     */
    async listDrivesInPage(pageToken, pageSize = 10) {
      const drive = this.drive();
      const { data } = await drive.drives.list({
        pageSize,
        pageToken,
      });
      return data;
    },
    /**
     * This method yields the visible GDrive drives of the authenticated
     * account. It is a wrapper around [the `drive.drives.list`
     * API](https://bit.ly/3AiWE1x) but defined as a generator to enable lazy
     * loading of multiple pages.
     *
     * @typedef {object} Drive - an object representing a GDrive drive, as
     * defined by [the API](https://bit.ly/3ycifGY)
     *
     * @yields
     * @type {Drive}
     */
    async *listDrives() {
      let pageToken;

      while (true) {
        const {
          drives = [],
          nextPageToken,
        } = await this.listDrivesInPage(
          pageToken,
        );

        for (const drive in drives) {
          yield drive;
        }

        if (!nextPageToken) {
          // The 'nextPageToken' field is only returned when there's still
          // comments to be retrieved (i.e. when the end of the list has not
          // been reached yet): https://bit.ly/3jwxbvy
          break;
        }

        pageToken = nextPageToken;
      }
    },
    async _listDriveOptions(pageToken) {
      const {
        drives,
        nextPageToken,
      } = await this.listDrivesInPage(pageToken);

      // "My Drive" isn't returned from the list of drives, so we add it to the
      // list and assign it a static ID that we can refer to when we need. We
      // only do this during the first page of options (i.e. when `pageToken` is
      // undefined).
      const options =
        pageToken !== undefined
          ? []
          : [
            {
              label: "My Drive",
              value: MY_DRIVE_VALUE,
            },
          ];
      for (const d of drives) {
        options.push({
          label: d.name,
          value: d.id,
        });
      }
      return {
        options,
        context: {
          nextPageToken,
        },
      };
    },
    /**
     * A utility method around [the `drive.files.list`
     * API](https://bit.ly/366CFVN) but scoped to a specific page of the API
     * response
     *
     * @typedef {object} FileListPage - an object representing a page that lists
     * GDrive files, as defined by [the API](https://bit.ly/3xdbAwc)
     *
     * @param {string} [pageToken] - the page token for the next page of shared
     * drives
     * @param {object} [extraOpts = {}] - an object containing extra/optional
     * parameters to be fed to the GDrive API call, as defined in [the API
     * docs](https://bit.ly/3AnQDR1)
     *
     * @returns
     * @type {FileListPage}
     */
    async listFilesInPage(pageToken, extraOpts = {}) {
      const drive = this.drive();
      const { data } = await drive.files.list({
        pageToken,
        ...extraOpts,
      });
      return data;
    },
    /**
     * A utility method around [the `drive.files.list`
     * API](https://bit.ly/366CFVN) but scoped to a specific page of the API
     * response, and intended to be used as a way for prop definitions to return
     * a list of options.
     *
     * @param {string} [pageToken] - the page token for the next page of shared
     * drives
     * @param {object} [extraOpts = {}] - an object containing extra/optional
     * parameters to be fed to the GDrive API call, as defined in [the API
     * docs](https://bit.ly/3AnQDR1)
     *
     * @returns a list of prop options
     */
    async listFilesOptions(pageToken, extraOpts = {}) {
      const {
        files,
        nextPageToken,
      } = await this.listFilesInPage(
        pageToken,
        extraOpts,
      );
      const options = files.map((file) => ({
        label: file.name,
        value: file.id,
      }));
      return {
        options,
        context: {
          nextPageToken,
        },
      };
    },
    // TODO: Document
    async listDriveFilesOptions(drive, pageToken = null, baseOpts = {}) {
      const opts = getListFilesOpts(drive, baseOpts);
      return this.listFilesOptions(pageToken, opts);
    },
    /**
     * This method yields comments made to a particular GDrive file. It is a
     * wrapper around [the `drive.comments.list` API](https://bit.ly/2UjYajv)
     * but defined as a generator to enable lazy loading of multiple pages.
     *
     * @typedef {object} Comment - an object representing a comment in a GDrive
     * file, as defined by [the API](https://bit.ly/3htAd12)
     *
     * @yields
     * @type {Comment}
     */
    async *listComments(fileId, startModifiedTime = null) {
      const drive = this.drive();
      const opts = {
        fileId,
        fields: "*",
        pageSize: 100,
      };

      if (startModifiedTime !== null) {
        opts.startModifiedTime = new Date(startModifiedTime).toISOString();
      }

      while (true) {
        const { data } = await drive.comments.list(opts);
        const {
          comments = [],
          nextPageToken,
        } = data;

        for (const comment of comments) {
          yield comment;
        }

        if (!nextPageToken) {
          // The 'nextPageToken' field is only returned when there's still
          // comments to be retrieved (i.e. when the end of the list has not
          // been reached yet): https://bit.ly/3w9ru9m
          break;
        }

        opts.pageToken = nextPageToken;
      }
    },
    _makeWatchRequestBody(id, address) {
      const expiration =
        Date.now() + WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS;
      return {
        id, // the component-specific channel ID, a UUID
        type: "web_hook",
        address, // the component-specific HTTP endpoint
        expiration,
      };
    },
    async watchDrive(id, address, pageToken, driveId) {
      const drive = this.drive();
      const requestBody = this._makeWatchRequestBody(id, address);
      let watchRequest = {
        pageToken,
        requestBody,
      };

      // Google expects an entirely different object to be passed
      // when you make a watch request for My Drive vs. a shared drive
      // "My Drive" doesn't have a driveId, so if this method is called
      // without a driveId, we make a watch request for My Drive
      if (driveId) {
        watchRequest = {
          ...watchRequest,
          driveId,
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        };
      }

      // When watching for changes to an entire account, we must pass a pageToken,
      // which points to the moment in time we want to start watching for changes:
      // https://developers.google.com/drive/api/v3/manage-changes
      const {
        expiration,
        resourceId,
      } = (
        await drive.changes.watch(watchRequest)
      ).data;
      console.log(`Watch request for drive successful, expiry: ${expiration}`);
      return {
        expiration: parseInt(expiration),
        resourceId,
      };
    },
    async watchFile(id, address, fileId) {
      const drive = this.drive();
      const requestBody = this._makeWatchRequestBody(id, address);
      const {
        expiration,
        resourceId,
      } = (
        await drive.files.watch({
          fileId,
          requestBody,
          supportsAllDrives: true,
        })
      ).data;
      console.log(
        `Watch request for file ${fileId} successful, expiry: ${expiration}`,
      );
      return {
        expiration: parseInt(expiration),
        resourceId,
      };
    },
    async stopNotifications(id, resourceId) {
      // id = channelID
      // See https://github.com/googleapis/google-api-nodejs-client/issues/627
      const drive = this.drive();

      // If for some reason the channel doesn't exist, this throws an error
      // It's OK for this to fail in those cases, since we'll renew the channel
      // immediately after trying to stop it if we still want notifications,
      // so we squash the error, log it, and move on.
      try {
        await drive.channels.stop({
          resource: {
            id,
            resourceId,
          },
        });
        console.log(`Stopped push notifications on channel ${id}`);
      } catch (err) {
        console.error(
          `Failed to stop channel ${id} for resource ${resourceId}: ${err}`,
        );
      }
    },
    async getFile(fileId, params = {}) {
      const { fields = "*" } = params;
      const drive = this.drive();
      return (
        await drive.files.get({
          fileId,
          fields,
        })
      ).data;
    },
    async getDrive(driveId) {
      const drive = this.drive();
      return (
        await drive.drives.get({
          driveId,
        })
      ).data;
    },
    async activateHook(channelID, url, drive) {
      const startPageToken = await this.getPageToken();
      const {
        expiration,
        resourceId,
      } = await this.watchDrive(
        channelID,
        url,
        startPageToken,
        drive,
      );
      return {
        startPageToken,
        expiration,
        resourceId,
      };
    },
    async deactivateHook(channelID, resourceId) {
      if (!channelID) {
        console.log(
          "Channel not found, cannot stop notifications for non-existent channel",
        );
        return;
      }

      if (!resourceId) {
        console.log(
          "No resource ID found, cannot stop notifications for non-existent resource",
        );
        return;
      }

      await this.stopNotifications(channelID, resourceId);
    },
    async invokedByTimer(drive, subscription, url, channelID, pageToken) {
      const newChannelID = channelID || uuid();
      const driveId = this.getDriveId(drive);
      const newPageToken = pageToken || (await this.getPageToken(driveId));

      const {
        expiration,
        resourceId,
      } = await this.checkResubscription(
        subscription,
        newChannelID,
        newPageToken,
        url,
        drive,
      );

      return {
        newChannelID,
        newPageToken,
        expiration,
        resourceId,
      };
    },
    async checkResubscription(
      subscription,
      channelID,
      pageToken,
      endpoint,
      drive,
    ) {
      const driveId = this.getDriveId(drive);
      if (subscription && subscription.resourceId) {
        console.log(
          `Notifications for resource ${subscription.resourceId} are expiring at ${subscription.expiration}. Stopping existing sub`,
        );
        await this.stopNotifications(channelID, subscription.resourceId);
      }

      const {
        expiration,
        resourceId,
      } = await this.watchDrive(
        channelID,
        endpoint,
        pageToken,
        driveId,
      );
      return {
        expiration,
        resourceId,
      };
    },

    async findFolder({
      drive: driveProp,
      name,
      parentId,
      excludeTrashed = true,
    } = {}) {
      const drive = this.drive();
      let q = "mimeType = 'application/vnd.google-apps.folder'";
      if (name) {
        q += ` and name = '${name}'`;
      }
      if (parentId) {
        q += ` and '${parentId}' in parents`;
      }
      if (excludeTrashed) {
        q += " and trashed != true";
      }
      const opts = getListFilesOpts(driveProp, {
        q,
      });
      return (await drive.files.list(opts)).data.files;
    },

    async createPermission(fileId, opts = {}) {
      const {
        role = "reader",
        type,
        domain,
        emailAddress,
      } = opts;
      const drive = this.drive();
      return (
        await drive.permissions.create({
          fileId,
          requestBody: {
            role,
            type,
            domain: domain || undefined,
            emailAddress: emailAddress || undefined,
          },
        })
      ).data;
    },
    async copyFile(fileId, opts = {}) {
      const {
        fields = "*",
        ...extraParams
      } = opts;
      const drive = this.drive();
      return (
        await drive.files.copy({
          fileId,
          fields,
          ...extraParams,
        })
      ).data;
    },

    async createFile(opts = {}) {
      const {
        file,
        mimeType = undefined,
        name,
        parentId,
        fields,
        requestBody,
        ...extraParams
      } = opts;
      const drive = this.drive();
      return (
        await drive.files.create({
          fields,
          media: file
            ? {
              mimeType,
              body: file,
            }
            : undefined,
          requestBody: {
            name,
            mimeType,
            parents: parentId
              ? [
                parentId,
              ]
              : undefined,
            ...requestBody,
          },
          ...extraParams,
        })
      ).data;
    },

    async createFolder(opts = {}) {
      const {
        name,
        parentId,
        fields = "*",
        ...extraOpts
      } = opts;
      return await this.createFile({
        name,
        parentId,
        fields,
        mimeType: "application/vnd.google-apps.folder",
        ...extraOpts,
      });
    },

    async createDrive(opts = {}) {
      const {
        name,
        ...extraParams
      } = opts;
      const drive = this.drive();
      return (
        await drive.drives.create({
          requestId: uuid(), // TODO: Update to v4 from uuid
          requestBody: {
            name,
          },
          ...extraParams,
        })
      ).data;
    },

    async deleteFile(fileId) {
      const drive = this.drive();
      return (
        await drive.files.delete({
          fileId,
        })
      ).data;
    },

    async deleteSharedDrive(driveId) {
      const drive = this.drive();
      return (
        await drive.files.delete({
          driveId,
        })
      ).data;
    },

    async getSharedDrive(driveId, opts = {}) {
      const { useDomainAdminAccess } = opts;
      const drive = this.drive();
      return (
        await drive.drives.get({
          driveId,
          useDomainAdminAccess,
        })
      ).data;
    },

    async updateFileMedia(fileId, fileStream, opts = {}) {
      const {
        mimeType,
        ...extraParams
      } = opts;
      const drive = this.drive();
      return (
        await drive.files.update({
          fileId,
          media: {
            mimeType,
            body: fileStream,
          },
          ...extraParams,
        })
      ).data;
    },

    async updateFile(fileId, opts = {}) {
      const {
        name,
        mimeType,
        fields,
        removeParents,
        addParents,
        requestBody,
        ...extraParams
      } = opts;
      const drive = this.drive();
      return (
        await drive.files.update({
          fileId,
          removeParents,
          addParents,
          fields,
          requestBody: {
            name,
            mimeType,
            ...requestBody,
          },
          ...extraParams,
        })
      ).data;
    },

    async searchDrives(opts = {}) {
      const {
        q,
        useDomainAdminAccess,
        ...extraParams
      } = opts;
      const drive = this.drive();
      return (
        await drive.drives.list({
          q,
          useDomainAdminAccess,
          ...extraParams,
        })
      ).data;
    },

    async updateSharedDrive(driveId, opts = {}) {
      const {
        useDomainAdminAccess,
        requestBody,
        ...extraParams
      } = opts;
      const drive = this.drive();
      return (
        await drive.drives.update({
          driveId,
          useDomainAdminAccess,
          requestBody: {
            ...requestBody,
          },
          ...extraParams,
        })
      ).data;
    },
  },
};
