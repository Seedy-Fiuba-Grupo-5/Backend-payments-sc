const { ProjectDB } = require("../models/project");
const { db } = require("../db");

async function create(dataDict) {
  await ProjectDB.create(dataDict);
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

async function update(publicId, updatesDict) {
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
  get,
  create,
  update
};