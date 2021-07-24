function schema() {
  return {
    description: 'Get transaction information',
    headers: {
      type: 'object',
      properties: {
        'Authorization': {
          type: 'string',
          description: "Example: Bearer 12345"
        }
      }
    },
    query: {
      type: 'object',
      properties: {
        'amountEthers': {
          type: 'string',
          description: "Example: 4"
        },
        'fromPublicId': {
          type: 'integer',
          description: "Example: 23"
        },
        'fromType': {
          type: 'string',
          description: "Example: project"
        },
        'toPublicId': {
          type: 'integer',
          description: "Example: 23"
        },
        'toType': {
          type: 'string',
          description: "Example: user"
        },
        'transactionType': {
          type: 'string',
          description: "Example: found"
        },
        'transactionState': {
          type: 'string',
          description: "Example: mining"
        }

      }

    },

    response: {
      200: {
        type: 'object',
        properties: {
          transactionId: { type: 'number' },
          amountEthers: { type: 'string' },
          fromPublicId: { type: 'integer' },
          fromType: { type: 'string' },
          toPublicId: { type: 'integer' },
          toType: { type: 'string' },
          transactionType: { type: 'string' },
          transactionState: { type: 'string' },
        }
      }
    },
    required: ['Authorization']
  };
}

module.exports = { schema };
