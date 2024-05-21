const mime = require("mime-types");

const getContentType = (fileExtension) => {
  return mime.contentType(`.${fileExtension}`);
};

module.exports={getContentType}