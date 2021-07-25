function schema() {
  return {
    description: 'Recreates database; only allowed in development',
    headers: {
      type: 'object',
      properties: { 
        'Authorization': { 
          type: 'string',
          description: "Example: Bearer 12345"
        } 
      }
    },
    response: {
      204: {},
      405: {}
    },
    required: ['Authorization']
  };
}

module.exports = { schema };
