const { preHandler } = require("../handlers/authPreHandler");
const { handler } = require("../handlers/fundProjectHandler");
const { schema } = require("../schemas/fundProjectSchema");


function route() {
  return {
    method: "POST",
    url: "/projects/:publicId/funds",
    schema: schema(),
    preHandler: preHandler,
    handler: handler(),
  };
}

module.exports = { route };
