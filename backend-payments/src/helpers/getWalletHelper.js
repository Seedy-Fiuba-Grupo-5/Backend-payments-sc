function parse(request) {
  data = {
    publicId: request.params.publicId,
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