const { ProjectDB } = require("../db/models/project");

const createProject = () => async (
  stagesCost,
  ownerPublicId,
  reviewerPublicId,
  publicId,
) => {
  var creationStatus = "building";
  const projectRepr = await ProjectDB.create({
    "publicId": publicId,
    "privateId": null,
    "creationStatus": creationStatus,
    "stagesCost": stagesCost,
    "ownerPublicId": ownerPublicId,
    "reviewerPublicId": reviewerPublicId,
    "balance": null,
  });

  return projectRepr;
};

const getProject = () => async id => {
  return await ProjectDB.findByPk(id);
};

module.exports = dependencies => ({
  createProject: createProject(dependencies),
  getProject: getProject(dependencies),
});
