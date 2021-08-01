function parse(request) {
  data = {
    publicId: parseInt(request.params.publicId),
    reviewerPublicId: request.body.reviewerPublicId
  };
  return data;
}

function format(result) {
  responses = {
    'building': [202, result],
    'mining': [202, result],
    'done': [202, result],
    'PROJECT_NOT_FOUND': [404, {'status': 'The project requested could not be found'}],
    'REVIEWER_NOT_FOUND': [404, {'status': 'The reviewer requested could not be found'}],
    'REVIEWER_OVERWRITE': [409, {'status': 'The reviewer has already been set'}]
  };
  let [code, _body] = responses[result.creationStatus];
  body = JSON.stringify(_body);
  return [code, body];
}

module.exports = {
  parse,
  format
};
