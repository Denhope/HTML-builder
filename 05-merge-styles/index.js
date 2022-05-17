const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "styles");
const bundlePatch = path.join(__dirname, "project-dist", "bundle.css");

async function createCssFile() {
  const streamWriteBundle = fs.createWriteStream(bundlePatch);

  fs.promises
    .readdir(folderPath, { withFileTypes: true })
    .then((fileCssList) => {
      for (let fileCss of fileCssList) {
        if (fileCss.isFile() && path.extname(fileCss.name) == ".css") {
          const streamFiles = fs.createReadStream(
            path.join(folderPath, fileCss.name)
          );
          streamFiles.on("data", (styleData) =>
            streamWriteBundle.write(`${styleData}\n`)
          );
        }
      }
    });
}

createCssFile();
