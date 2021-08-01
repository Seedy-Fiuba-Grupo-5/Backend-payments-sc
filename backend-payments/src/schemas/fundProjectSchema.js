function schema() {
  return {
    description: 'Funds an existing project in FUNDING state',
    params: {
      type: 'object',
      properties: {
        publicId: {
          description: 'The id of the project to fund',
          type: 'number'
        }
      }
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
          transactionState: { type: 'string', enum: ['mining', 'Done'] }
        }
      },
      400: {
        type: 'object',
        properties: {
          status: {
            description: 'Invalid amount of ethers',
            type: 'string'
          }
        }
      },
      404: {
        type: 'object',
        properties: {
          status: {
            description: 'Project not found / Funder not found',
            type: 'string'
          }
        }
      },
      405: {
        type: 'object',
        properties: {
          status: {
            description: 'Project not in FUNDING state',
            type: 'string'
          }
        }
      },
      409: {
        type: 'object',
        properties: {
          status: {
            description: 'There is not enough balance in funder wallet to execute the transaction',
            type: 'string'
          }
        }
      }
    },
    required: ['Authorization', 'publicId']
  };
}

module.exports = { schema };
