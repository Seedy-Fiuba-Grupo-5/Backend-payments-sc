function parse(request) {
  stagesCost = request.body.stagesCost.map((i)=>i.toString());
  data = {
    publicId: request.body.publicId,
    stagesCost: stagesCost,
    ownerPublicId: request.body.ownerPublicId,
    reviewerPublicId: request.body.reviewerPublicId
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
