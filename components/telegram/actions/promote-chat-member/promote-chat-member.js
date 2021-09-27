const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-promote-chat-member",
  name: "Promote a Chat Member",
  description: "Use this method to promote or demote a user in a supergroup or a channel",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
    chatId: {
      propDefinition: [
        telegram,
        "chatId",
      ],
    },
    userId: {
      propDefinition: [
        telegram,
        "userId",
      ],
    },
    can_change_info: {
      type: "boolean",
      label: "Set if the Administrator Can Change Info",
      description: "Pass True, if the administrator can change chat title, photo and other settings.",
      optional: true,
    },
    can_post_messages: {
      type: "boolean",
      label: "Set if the Administrator Can Create Channel Posts",
      description: "Pass True, if the administrator can create channel posts [channels only].",
      optional: true,
    },
    can_edit_messages: {
      type: "boolean",
      label: "Set if the Administrator Can Edit Messages",
      description: "Pass True, if the administrator can edit messages of other users and can pin messages [channels only].",
      optional: true,
    },
    can_delete_messages: {
      type: "boolean",
      label: "Set if the Administrator Can Delete Messages",
      description: "Pass True, if the administrator can delete messages of other users [channels only].",
      optional: true,
    },
    can_invite_users: {
      type: "boolean",
      label: "Set if the Administrator Can Invite Users",
      description: "Pass True, if the administrator can invite new users to the chat.",
      optional: true,
    },
    can_restrict_members: {
      type: "boolean",
      label: "Set if the Administrator Can Restrict Members",
      description: "Pass True, if the administrator can restrict, ban or unban chat members.",
      optional: true,
    },
    can_pin_messages: {
      type: "boolean",
      label: "Set if the Administrator Can Pin Messages",
      description: "Pass True, if the administrator can pin messages [supergroups only].",
      optional: true,
    },
    can_promote_members: {
      type: "boolean",
      label: "Set if the Administrator Can Promote Members",
      description: "Pass True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by them).",
      optional: true,
    },
  },
  async run() {

  },
};
