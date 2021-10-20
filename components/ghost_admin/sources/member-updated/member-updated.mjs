import common from "../common-webhook.mjs";

export default {
  ...common,
  type: "source",
  key: "ghost_admin-member-updated",
  name: "Member Updated (Instant)",
  description: "Emit new event each time a member is updated.",
  version: "0.0.4",
  methods: {
    ...common.methods,
    getEvent() {
      return "member.edited";
    },
    generateMeta(body) {
      return ({
        id: body.member.current.id,
        summary: body.member.current.name,
        ts: Date.now(),
      });
    },
  },
};
