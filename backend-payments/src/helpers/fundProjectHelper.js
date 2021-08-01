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
    'Mining': [202, result],
    'Done': [202, result],
    'INVALID_AMOUNT_ETHERS': [400, {'status': 'The amount of ethers should be valid'}],
    'PROJECT_NOT_FOUND': [404, {'status': 'The project requested could not be found'}],
    'FUNDER_NOT_FOUND': [404, {'status': 'The funder requested could not be found'}],
    'NOT_FUNDING': [405, {'status': 'The project must be in "Funding" state'}],
    'Not enough balance': [409, {'status': 'Not enough balance'}]
  };
  let [code, _body] = responses[result.transactionState];
  body = JSON.stringify(_body);
  return [code, body]
}

module.exports = {
  parse,
  format
};
