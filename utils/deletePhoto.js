let fs = require("fs");
let path = require("path");

module.exports = async (filename) => {
  await fs.promises.unlink(
    path.join(__dirname, `../public/images/products/${filename}`)
  );
};

