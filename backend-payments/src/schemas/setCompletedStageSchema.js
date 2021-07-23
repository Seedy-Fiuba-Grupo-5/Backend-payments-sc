function schema() {
  return {
    description: 'Set an stage of a project (in IN_PROGRESS state) as completed',
    params: {
      type: 'object',
      properties: {
        publicId: {
          description: 'The project public id',
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
        reviewerPublicId: {
          description: 'The public id of the reviewer of the project who wants to set the stage completed',
          type: 'number'
        },
        stageNumber: {
          description: "The stage's number to set as completed",
          type: 'number'
        }
      }
    },
    required: ['Authorization', 'publicId', 'reviewerPublicId','stageNumber'],
    response: {
      202: {
        type: 'object',
        properties: {
          amountEthers: { type: 'string' },
          fromPublicId: { type: 'number' },
          fromType: { type: 'string', enum: ['project'] },
          toPublicId: { type: 'number' },
          toType: { type: 'string', enum: ['user'] },
          transactionType: { type: 'string', enum: ['stageCompleted'] },
          transactionState: { type: 'string', enum: ['mining', 'done'] }
        }
      }
    }
  };
}

module.exports = { schema };
