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
    'INVALID_AMOUNT_ETHERS': [400, {'status': 'The amount of ethers should be valid'}],
    'PROJECT_NOT_FOUND': [404, {'status': 'The project requested could not be found'}],
    'FUNDER_NOT_FOUND': [404, {'status': 'The funder requested could not be found'}],
    'NOT_FUNDING': [405, {'status': 'The project must be in FUNDING state to execute this action'}],
    'NOT_ENOUGH_BALANCE': [409, {'status': 'The current balance is not enough to execute this transaction'}]
  };
  let [code, _body] = responses[result.transactionState];
  body = JSON.stringify(_body);
  return [code, body]
}

module.exports = {
  parse,
  format
};
