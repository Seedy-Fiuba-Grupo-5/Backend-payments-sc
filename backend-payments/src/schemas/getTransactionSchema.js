function schema() {
  return {
    description: 'Get transaction information',
    params: {
      type: 'object',
      properties: {
        transactionId: {
          type: 'number',
          description: 'The transaction id'
        }
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
          transactionId: { type: 'number' },
          amountEthers: { type: 'string' },
          fromPublicId: { type: 'integer' },
          fromType: { type: 'string' },
          toPublicId: { type: 'integer' },
          toType: { type: 'string' },
          transactionType: { type: 'string' },
          transactionState: { type: 'string' },
        }
      },
      404: {
        type: 'object',
        properties: {
          status: {
            description: 'Transaction not found',
            type: 'string'
          }
        }
      }
    },
    required: ['transactionId', 'Authorization']
  };
}

module.exports = { schema };
