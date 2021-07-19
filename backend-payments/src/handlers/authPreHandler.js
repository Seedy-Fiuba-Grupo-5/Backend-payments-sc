const { apiKey } = require("../config");

function preHandler(request, reply, done) {
  url = request.url;
  unlockedURLs = ['/', '/./static/index.html'];
  if ( unlockedURLs.includes(url) ) {
    // Continue to the handler
    done();
    return;
  }

  const header = request.raw.headers.authorization
  if (!header) {
    body = { "status" : 'Missing authorization header' };
    reply.code(400).send(body);
    done();
  }

  let [type, key] = header.split(' ');
  if (type != 'Bearer') {
    body = { "status" : 'Missing authorization bearer' };
    reply.code(400).send(body);
    done();
  }

  if (key != apiKey) {
    body = { "status" : 'Unauthorized' };
    reply.code(401).send(body);
    done();
  }
  // Continue to the handler
  done();
}

module.exports = { preHandler };