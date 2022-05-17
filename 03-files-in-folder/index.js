const fs = require("fs");
const path = require("path");

const folder = path.join(__dirname, "secret-folder");

fs.promises.readdir(folder, { withFileTypes: true }).then((files) => {
  for (let file of files) {
    if (file.isFile()) {
      printInfo(file.name);
    }
  }
});

async function printInfo(file) {
  let filePath = path.join(folder, file);

  let fileName = path.basename(file, path.extname(file));
  let fileExtension = path.extname(file).slice(1);

  fs.stat(filePath, (error, data) => {
    let fileSize = data.size;
    console.log(`${fileName} - ${fileExtension} - ${fileSize}b`);
  });
}
