function schema() {
  return {
    description: 'Creates a new wallet',
    params: {
      Authorization: {
        in: 'header',
        type: 'object',
        example: 'Bearer <API KEY>'
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
    required: ['publicId']
  };
}

module.exports = { schema };