function createProjectParse(request) {
  data = {
    publicId: request.body.publicId,
    stagesCost: request.body.stagesCost,
    ownerPublicId: request.body.ownerPublicId,
    reviewerPublicId: request.body.reviewerPublicId
  };
  return data;
}

function createProjectFormat(result) {
  code = 202;
  body = result;
  return [code, body]
}

module.exports = { 
  createProjectParse,
  createProjectFormat
};