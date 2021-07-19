const options = {
  exposeRoute: true,
  routePrefix: '/',
  swagger: {
    info: {
      title: 'Seedyfiuba backend payments server API',
      description: 'This server is mean to educative purposes; do not use in production',
      version: '1.0.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    basePath: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
};

module.exports = { options }