const { preHandler } = require("../handlers/authPreHandler");
const { handler } = require("../handlers/updateProjectHandler");
const { schema } = require("../schemas/updateProjectSchema");

function route() {
  return {
    method: "PATCH",
    url: "/projects/:publicId",
    schema: schema(),
    preHandler: preHandler,
    handler: handler(),
  };
}

module.exports = { route };
