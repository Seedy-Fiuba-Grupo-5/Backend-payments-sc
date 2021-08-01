function parse(request) {
  data = {
    publicId: request.params.publicId,
  };
  return data;
}

function format(result) {
  responses = {
    'building': [200, result],
    'mining': [200, result],
    'Done': [200, result],
    'PROJECT_NOT_FOUND': [404, {'status': 'The project requested could not be found'}]
  };
  let [code, _body] = responses[result.creationStatus];
  body = JSON.stringify(result);
  return [code, body];
}

module.exports = {
  parse,
  format
};
