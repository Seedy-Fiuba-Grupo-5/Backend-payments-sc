const getProject = require("../handlers/getProjectHandler");

function route() {
  return {
    method: "GET",
    url: "/projects/:publicId",
    schema: getProject.schema(),
    handler: getProject.handler(),
  };
}

module.exports = { route };
