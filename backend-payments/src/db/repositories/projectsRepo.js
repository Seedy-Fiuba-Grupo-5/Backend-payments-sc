const { ProjectDB } = require("../models/project");
const { db } = require("../db");

async function createProjectDB(dataDict) {
  await ProjectDB.create(dataDict);
}

async function getProjectDB(publicId) {
  const t = await db.transaction();
  try {
    projectRepr = await ProjectDB.findByPk(
      publicId,
      { transaction: t }
    );
    t.commit();
    return projectRepr;
  } catch (error) {
    t.rollback();
    throw error;
  }
}

async function get(publicId) {
  const t = await db.transaction();
  try {
    projectRepr = await ProjectDB.findByPk(
      publicId,
      { transaction: t }
    );
    t.commit();
    return projectRepr;
  } catch (error) {
    t.rollback();
    throw error;
  }
}

async function updateProjectDB(publicId, updatesDict) {
  const t = await db.transaction();
  try {
    await ProjectDB.update(
      updatesDict,
      {
        where: { publicId: publicId },
        transaction: t
      });
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

module.exports = {
  createProjectDB,
  getProjectDB,
  updateProjectDB,
  get
};