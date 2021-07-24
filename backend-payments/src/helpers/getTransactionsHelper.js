function parse(request) {
  data = {
    query: request.query
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
