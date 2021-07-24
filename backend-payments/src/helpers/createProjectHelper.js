function parse(request) {
  stagesCost = request.body.stagesCost.map((i)=>i.toString());
  data = {
    publicId: request.body.publicId,
    stagesCost: stagesCost,
    ownerPublicId: request.body.ownerPublicId,
    reviewerPublicId: request.body.reviewerPublicId
  };
  return data;
}

function format(result) {
  code = 202;
  _body = result;
  if (result === null) {
    code = 404;
    _body = { "status": "Either owner or Reviewer wallet requested could not be found"};
  }
  body = JSON.stringify(_body);
  return [code, body]
}

module.exports = {
  parse,
  format
};
