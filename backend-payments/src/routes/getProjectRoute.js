const { preHandler } = require("../handlers/authPreHandler");
const getProject = require("../handlers/getProjectHandler");

function route() {
  return {
    method: "GET",
    url: "/projects/:publicId",
    schema: getProject.schema(),
    preHandler: preHandler,
    handler: getProject.handler(),
  };
}

module.exports = { route };
