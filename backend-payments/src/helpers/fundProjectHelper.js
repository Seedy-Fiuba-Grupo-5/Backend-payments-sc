function parse(request) {
  data = {
    projectPublicId: parseInt(request.params.publicId),
    userPublicId: request.body.userPublicId,
    amountEthers: request.body.amountEthers.toString()
  };
  return data;
}

function format(result) {
  responses = {
    'building': [202, result],
    'mining': [202, result],
    'done': [202, result],
    'PROJECT_NOT_FOUND': [404, {'status': 'The project requested could not be found'}],
    'NOT_FUNDING': [409, {'status': 'The project is not in FUNDING state'}],
    'NOT_ENOUGH_BALANCE': [409, {'status': 'The sender has not enough balance to make this transaction'}]
  };
  let [code, _body] = responses[result.transactionState];
  body = JSON.stringify(_body);
  return [code, body]
}

module.exports = {
  parse,
  format
};
