const { preHandler } = require("../handlers/authPreHandler");
const { handler } = require("../handlers/getProjectHandler");
const { schema } = require("../schemas/getProjectSchema");

function route() {
  return {
    method: "GET",
    url: "/projects/:publicId",
    schema: schema(),
    preHandler: preHandler,
    handler: handler(),
  };
}

module.exports = { route };
