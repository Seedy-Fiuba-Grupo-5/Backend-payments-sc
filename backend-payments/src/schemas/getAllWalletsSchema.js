function schema() {
  return {
    description: 'Creates a new wallet',
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
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            publicId: { type: 'integer' },
            address: { type: 'string' },
            privateKey: { type: 'string' }
          }
        }
      }
    },
    required: ['Authorization']
  };
}

module.exports = { schema };