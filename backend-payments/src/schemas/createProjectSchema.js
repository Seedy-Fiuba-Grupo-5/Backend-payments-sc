function schema() {
  return {
    description: 'Creates a new project',
    headers: {
      type: 'object',
      properties: { 
        Authorization: { 
          description: 'Example: Bearer 12345',
          type: 'string',
        } 
      }
    },
    body: {
      type: 'object',
      properties: {
        publicId: {
          description: 'Public ID of the project',
          type: 'number'
        },
        ownerPublicId: {
          description: 'User id of the owner of the project',
          type: 'number'
        },
        reviewerPublicId: {
          description: 'User id of the reviewer of the project',
          type: 'integer'
        },
        stagesCost: {
          description: 'Sorted array of cost (ether) by stage',
          type: 'array',
          minItems: 1,
          items: { type: 'number' }
        }
      }
    },
    required: [
      'Authorization', 
      'publicId', 
      'ownerPublicId', 
      'reviewerPublicId', 
      'stagesCost'
    ],
    response: {
      201: {
        type: 'object',
        properties: {
          publicId: { type: 'number' },
          ownerPublicId: { type: 'number' },
          reviewerPublicId: { example: -1 },
          stagesCost: {
            type: 'array',
            minItems: 1,
            items: { type: 'number' },
          },
          creationStatus: {
            description: "Project's creation status",
            type: 'string',
            enum: ["building"]
          },
          privateId: { example: -1 },
          balance: { example: '' }
        }
      },
      202: {
        type: 'object',
        properties: {
          publicId: { type: 'number' },
          ownerPublicId: { type: 'number' },
          reviewerPublicId: { type: 'number' },
          stagesCost: {
            type: 'array',
            minItems: 1,
            items: { type: 'number' },
          },
          creationStatus: {
            description: "Project's creation status",
            type: 'string',
            enum: ['mining', 'done'],
          },
          privateId: {
            description: "Project's id in smart contract",
            type: 'number',
            nullable: true
          },
          balance: { type: 'string', nullable: true }
        }
      }
    }
  };
}

module.exports = { schema };
