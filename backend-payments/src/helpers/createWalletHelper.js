function parse(request) {
  data = {
    publicId: request.body.publicId,
  };
  return data;
}

function format(result) {
  code = 201;
  body = JSON.stringify(result);
  return [code, body];
}

module.exports = { 
  parse,
  format
};