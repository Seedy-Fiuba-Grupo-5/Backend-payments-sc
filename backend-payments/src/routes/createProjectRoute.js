const { preHandler } = require('../handlers/authPreHandler');
const createProject = require("../handlers/createProjectHandler");

function route() {
  return {
    method: "POST",
    url: "/projects",
    schema: createProject.schema(),
    preHandler: preHandler,
    handler: createProject.handler(),
  };
}

module.exports = { route };
