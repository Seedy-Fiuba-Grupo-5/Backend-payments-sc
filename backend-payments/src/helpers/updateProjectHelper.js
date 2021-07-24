function parse(request) {
  data = {
    publicId: parseInt(request.params.publicId),
    reviewerPublicId: request.body.reviewerPublicId
  };
  return data;
}

function format(result) {
  code = 202;
  _body = result;
  if (result === null) {
    code = 404;
    _body = { "status": "The project or the reviewer's wallet requested could not be found"};
  }
  body = JSON.stringify(_body);
  return [code, body]
}

module.exports = {
  parse,
  format
};
