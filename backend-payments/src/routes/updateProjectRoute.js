const { preHandler } = require("../handlers/authPreHandler");
const updateProject = require("../handlers/updateProjectHandler");

function route() {
  return {
    method: "PATCH",
    url: "/projects/:publicId",
    schema: updateProject.schema(),
    preHandler: preHandler,
    handler: updateProject.handler(),
  };
}

module.exports = { route };
