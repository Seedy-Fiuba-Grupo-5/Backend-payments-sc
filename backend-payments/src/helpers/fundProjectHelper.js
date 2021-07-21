function parse(request) {
  data = {
    projectPublicId: parseInt(request.params.publicId),
    userPublicId: request.body.userPublicId,
    amountEthers: request.body.amountEthers
  };
  return data;
}

function format(result) {
  code = 202;
  body = result;
  return [code, body]
}

module.exports = { 
  parse,
  format
};