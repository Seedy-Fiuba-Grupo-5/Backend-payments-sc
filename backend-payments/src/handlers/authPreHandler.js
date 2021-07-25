const { log } = require('../log');
const { apiKey } = require("../config");

function authLog(message) {
  fullMessage = `Auth: ${message}`;
  log(fullMessage);
}

function preHandler(request, reply, done) {
  url = request.url;
  unlockedURLs = ['/', '/./static/index.html'];
  if ( unlockedURLs.includes(url) ) {
    message = 'Swagger documentation';
    authLog(message);
    done();
    return;
  }

  const header = request.raw.headers.authorization
  if (!header) {
    message = 'Missing authorization header'; 
    authLog(message);
    body = { "status" : message };
    console.log('\tbody:');
    console.log(body);
    reply.code(400).send(body);
    done();
  }

  let [type, key] = header.split(' ');
  if (type != 'Bearer') {
    message = 'Missing authorization bearer';
    authLog(message);
    console.log(`\tAuthorization type: ${type}`);
    body = { "status" : message };
    console.log('\tbody:');
    console.log(body);
    reply.code(400).send(body);
    done();
  }

  if (key != apiKey) {
    message = 'Unauthorized';
    authLog(message);
    body = { "status" : message };
    console.log('\tbody:');
    console.log(body);
    reply.code(401).send(body);
    done();
  }
  // Continue to the handler
  done();
}

module.exports = { preHandler };