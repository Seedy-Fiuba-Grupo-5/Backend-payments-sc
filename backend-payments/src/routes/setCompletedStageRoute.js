const { preHandler } = require("../handlers/authPreHandler");
const { handler } = require("../handlers/setCompletedStageHandler");
const { schema } = require("../schemas/setCompletedStageSchema");

function route() {
  return {
    method: "POST",
    url: "/projects/:publicId/stages",
    schema: schema(),
    preHandler: preHandler,
    handler: handler(),
  };
}

module.exports = { route };
