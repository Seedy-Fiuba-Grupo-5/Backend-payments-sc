function parse(request) {
  data = {
    projectPublicId: parseInt(request.params.publicId),
    userPublicId: request.body.userPublicId,
    amountEthers: request.body.amountEthers.toString()
  };
  return data;
}

function format(result) {
  code = 202;
  _body = result;
  if (result.transactionState === 'NOT_FUNDING') {
    code = 409;
    _body = {status: 'NOT_FUNDING'}
  } else if (result.transactionState === 'PROJECT_NOT_FOUND') {
    code = 404;
    _body = {status: 'The project requested could not be found'}
  }
  body = JSON.stringify(_body);
  return [code, body]
}

module.exports = {
  parse,
  format
};
