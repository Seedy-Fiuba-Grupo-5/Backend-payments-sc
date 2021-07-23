function parse(request) {
  data = {
    transactionId: request.params.transactionId,
  };
  return data;
}

function format(result) {
  code = 200;
  body = JSON.stringify(result);
  return [code, body]
}

module.exports = {
  parse,
  format
};
