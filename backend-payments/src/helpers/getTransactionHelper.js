function parse(request) {
  data = {
    transactionId: request.params.transactionId,
  };
  return data;
}

function format(result) {
  responses = {
    'building': [200, result],
    'Mining': [200, result],
    'Done': [200, result],
    'TRANSACTION_NOT_FOUND': [404, {'status': 'The requested transaction could not be found'}]
  };
  let [code, _body] = responses[result.transactionState];
  body = JSON.stringify(_body);
  return [code, body]
}

module.exports = {
  parse,
  format
};
