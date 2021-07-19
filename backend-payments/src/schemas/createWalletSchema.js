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
    body: {
      type: 'object',
      properties: {
        publicId: {
          type: 'integer',
          description: 'Public ID of the user to which the new wallet will be asigned'
        }
      }
    },
    response: {
      201: {
        type: 'object',
        properties: {
          publicId: { type: 'integer' },
          address: { type: 'string' },
          privateKey: { type: 'string' }
        }
      }
    },
    required: ['Authorization', 'publicId']
  };
}

module.exports = { schema };
