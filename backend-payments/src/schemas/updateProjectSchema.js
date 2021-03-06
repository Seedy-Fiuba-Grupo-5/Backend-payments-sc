function schema() {
  return {
    description: 'Updates an existent project',
    params: {
      type: 'object',
      properties: {
        publicId: {
          description: 'The project id',
          type: 'number',
        },
      },
    },
    headers: {
      type: 'object',
      properties: {
        Authorization: {
          description: 'Example: Bearer 12345',
          type: 'string'
        }
      }
    },
    body: {
      type: 'object',
      properties: {
        reviewerPublicId: {
          description: 'User id of the reviewer of the project',
          type: 'number'
        }
      }
    },
    required: [
      'Authorization',
      'publicId',
      'reviewerPublicId'
    ],
    response: {
      202: {
        type: 'object',
        properties: {
          publicId: { type: 'number' },
          ownerPublicId: { type: 'number' },
          reviewerPublicId: { type: 'number' },
          stagesCost: {
            type: 'array',
            minItems: 1,
            items: { type: 'string' },
          },
          creationStatus: {
            description: "Project's creation status",
            type: 'string',
            enum: ['Mining', 'Done']
          },
          privateId: {
            description: "Project's id in smart contract",
            type: 'number',
            nullable: true
          },
          balance: { type: 'string', nullable: true }
        }
      },
      404: {
        type: 'object',
        properties: {
          status: {
            description: 'Project not found / Reviewer not found',
            type: 'string'
          }
        }
      },
      409: {
        type: 'object',
        properties: {
          status: {
            description: 'There is already a reviewer asigned',
            type: 'string'
          }
        }
      }
    }
  };
}

module.exports = { schema };
