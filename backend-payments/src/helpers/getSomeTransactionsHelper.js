function parse(request) {
  data = {
    query: request.query
  };
  return data;
}

function format(result) {
  code = 200;
  _body = result;
  if (result === null) {
    code = 400;
    _body = {'status': 'Some query params are wrong'};
  }
  body = JSON.stringify(_body);
  return [code, body]
}

module.exports = {
  parse,
  format
};
