import common from "../common-webhook.mjs";

export default {
  ...common,
  type: "source",
  key: "ghost-page-published",
  name: "Page Published (Instant)",
  description: "Emit new event for each new page published on a site.",
  version: "0.0.4",
  methods: {
    ...common.methods,
    getEvent() {
      return "page.published";
    },
    generateMeta(body) {
      return ({
        id: body.page.current.id,
        summary: body.page.current.title,
        ts: Date.now(),
      });
    },
  },
};
