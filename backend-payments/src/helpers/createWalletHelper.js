function createWalletParse(request) {
  data = {
    publicId: request.body.publicId,
  };
  return data;
}

function createWalletFormat(result) {
  code = 201;
  body = result;
  return [code, body]
}

module.exports = { 
  createWalletParse,
  createWalletFormat
};