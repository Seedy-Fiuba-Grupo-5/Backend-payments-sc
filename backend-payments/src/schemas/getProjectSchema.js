function schema() {
  return {
    description: 'Get project information',
    params: {
      type: 'object',
      properties: {
        publicId: {
          type: 'integer',
          description: 'The project id'
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
          publicId: { type: 'number' },
          ownerPublicId: { type: 'number' },
          reviewerPublicId: { type: 'integer' },
          stagesCost: {
            type: 'array',
            minItems: 1,
            items: { type: 'string' },
          },
          stagesStates: {
            description: 'The states of completeness of each stage',
            type: 'array',
            minItems: 1,
            items: { type: 'boolean' },
          },
          creationStatus: {
            description: "Project's creation status",
            type: 'string',
            enum: ['building','Mining', 'Done'],
          },
          privateId: {
            description: "Project's id in smart contract",
            type: 'number',
            nullable: true
          },
          balance: { type: 'string', nullable: true },
          state: {
            description: 'The current state of the project',
            type: 'string',
            enum: ['Initializing', 'Funding', 'In progress', 'Completed']
          }
        }
      },
      404: {
        type: 'object',
        properties: {
          status: {
            description: 'Project not found',
            type: 'string'
          }
        }
      }
    },
    required: ['publicId', 'Authorization']
  };
}

module.exports = { schema };
