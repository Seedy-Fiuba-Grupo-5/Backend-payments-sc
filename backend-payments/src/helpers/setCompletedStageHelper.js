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
    'INVALID_STAGE_NUMBER': [400, {'status': 'The stage number should be between 1 and stages cost array length'}],
    'INVALID_REVIEWER': [403, {'status': 'Only the reviewer of the project can set stages as completed'}],
    'PROJECT_NOT_FOUND': [404, {'status': 'The project requested could not be found'}],
    'NOT_IN_PROGRESS': [405, {'status': 'The project must be "In progress" state'}],
    'Not enough balance': [409, {'status': 'Not enough balance'}],
    'STAGE_ALREADY_COMPLETED': [409, {'status': 'This stage has already been set as completed'}]
  };
  let [code, _body] = responses[result.transactionState];
  body = JSON.stringify(_body);
  return [code, body]
}

module.exports = {
  parse,
  format
};
