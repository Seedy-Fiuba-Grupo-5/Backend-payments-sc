const { preHandler } = require('../handlers/authPreHandler');
const { handler } = require("../handlers/createProjectHandler");
const { schema } = require('../schemas/createProjectSchema');

function route() {
  return {
    method: "POST",
    url: "/projects",
    schema: schema(),
    preHandler: preHandler,
    handler: handler(),
  };
}

module.exports = { route };
