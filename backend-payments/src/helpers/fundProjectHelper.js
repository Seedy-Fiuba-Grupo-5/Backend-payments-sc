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
  body = JSON.stringify(result);
  return [code, body]
}

module.exports = { 
  parse,
  format
};