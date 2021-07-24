function parse(request) {
  data = {
    projectPublicId: parseInt(request.params.publicId),
    reviewerPublicId: parseInt(request.body.reviewerPublicId),
    stageNumber: parseInt(request.body.stageNumber)
  };
  return data;
}

function format(result) {
  responses = {
    'building': [202, result],
    'mining': [202, result],
    'done': [202, result],
    'NOT_ENOUGH_BALANCE': [409, {'status': 'The current balance is not enough to make this transaction'}]
  };
  let [code, _body] = responses[result.transactionState];
  body = JSON.stringify(_body);
  return [code, body]
}

module.exports = { 
  parse,
  format
};
