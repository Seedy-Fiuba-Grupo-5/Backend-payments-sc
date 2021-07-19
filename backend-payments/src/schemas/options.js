const options = {
  exposeRoute: true,
  routePrefix: '/',
  swagger: {
    info: {
      title: 'Seedyfiuba backend payments server API'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
};

module.exports = { options }