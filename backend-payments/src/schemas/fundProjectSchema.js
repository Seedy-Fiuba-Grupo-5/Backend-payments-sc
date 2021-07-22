function schema() {
  return {
    description: 'Funds an existing project in FUNDING state',
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
        userPublicId: {
          description: 'Public ID of the user who wants to fund the project',
          type: 'integer'
        },
        amountEthers: {
          description: 'Amount of ethers that the user wants to fund to the project',
          type: 'string'
        }
      }
    },
    response: {
      202: {
        type: 'object',
        properties: {
          amountEthers: { type: 'string' },
          fromPublicId: { type: 'number' },
          fromType: { type: 'string', enum: ['user'] },
          toPublicId: { type: 'number' },
          toType: { type: 'string', enum: ['project'] },
          transactionType: { type: 'string', enum: ['fund'] },
          transactionState: { type: 'string', enum: ['mining', 'done'] }
        }
      }
    },
    required: ['Authorization', 'publicId']
  };
}

module.exports = { schema };
