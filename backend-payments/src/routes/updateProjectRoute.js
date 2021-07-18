const updateProject = require("../handlers/updateProjectHandler");

function route() {
  return {
    method: "PATCH",
    url: "/projects/:publicId",
    schema: updateProject.schema(),
    handler: updateProject.handler(),
  };
}

module.exports = { route };
