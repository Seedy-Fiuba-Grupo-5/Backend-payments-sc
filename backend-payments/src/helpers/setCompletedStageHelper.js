function parse(request) {
  data = {
    projectPublicId: parseInt(request.params.publicId),
    reviewerPublicId: parseInt(request.body.reviewerPublicId),
    stageNumber: parseInt(request.body.stageNumber)
  };
  return data;
}

function format(result) {
  code = 202;
  body = JSON.stringify(result);
  return [code, body]
}

module.exports = { 
  parse,
  format
};
