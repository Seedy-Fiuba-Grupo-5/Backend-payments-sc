function parse(request) {
  data = {
    projectPublicId: parseInt(request.params.publicId),
    reviewerPublicId: parseInt(request.body.reviewerPublicId),
    stageNumber: parseInt(request.body.stageNumber)
  };
  return data;
}

function format(result) {
  code = 202;
  _body = result;
  if (result === null) {
    code = 405;
    _body = { "status": "Method not Allowed: Project status must be IN_PROGRESS in order to execute this action"};
  }
  body = JSON.stringify(_body);
  return [code, body]
}

module.exports = {
  parse,
  format
};
