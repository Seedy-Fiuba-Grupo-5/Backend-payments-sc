const createProject = require("../handlers/createProjectHandler");

function route() {
  return {
    method: "POST",
    url: "/projects",
    schema: createProject.schema(),
    handler: createProject.handler(),
  };
}

module.exports = { route };
