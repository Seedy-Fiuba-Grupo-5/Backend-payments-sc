function parse(request) {
  data = {
    publicId: request.params.publicId,
  };
  return data;
}

function format(result) {
  code = 200;
  _body = result
  if (result === 'WALLET_NOT_FOUND') {
    code = 404;
    _body = {'status': 'The requested wallet could not be found'}
  }
  body = JSON.stringify(_body);
  return [code, body]
}

module.exports = { 
  parse,
  format
};