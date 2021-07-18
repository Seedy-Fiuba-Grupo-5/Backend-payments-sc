function patchProjectParse(request) {
  data = {
    publicId: parseInt(request.params.publicId),
    reviewerPublicId: request.body.reviewerPublicId
  };
  return data;
}

function patchProjectFormat(result) {
  code = 202;
  body = result;
  if (projectRepr === null) {
    code = 404
    body = { "status": "The project requested could not be found"}
  }
  return [code, body]
}

module.exports = { 
  patchProjectParse,
  patchProjectFormat
};