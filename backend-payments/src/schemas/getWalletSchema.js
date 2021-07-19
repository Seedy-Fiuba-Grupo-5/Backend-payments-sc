function schema() {
  return {
    description: 'Gets all wallets information',
    params: {
      type: 'object',
      properties: {
        publicId: {
          type: 'integer',
          description: 'The user id of the wallet'
        },
      },
    },
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
        type: 'object',
        properties: {
          publicId: { type: 'integer' },
          address: { type: 'string' },
          privateKey: { type: 'string' },
          balance: { type: 'string' }
        }
      }
    },
    required: ['Authorization']
  };
}

module.exports = { schema };
