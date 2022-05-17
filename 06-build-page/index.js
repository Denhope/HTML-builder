const fs = require("fs");
const path = require("path");

const buildPagePath = path.join(__dirname, "project-dist");

const srsOrigPath = path.join(__dirname, "assets");
const srsCopyPath = path.join(__dirname, "project-dist", "assets");

main();

async function main() {
  await updateFolder();
  await createFolder(srsCopyPath);
  await copyDir(srsOrigPath, srsCopyPath);
  await createHTML();
  await createStyleFile();
}

//copyDir

async function updateFolder() {
  return fs.promises
    .rm(buildPagePath, { recursive: true, force: true })
    .then(() => fs.promises.mkdir(buildPagePath));
}

async function createFolder(folder) {
  fs.promises.mkdir(folder, { recursive: true }).catch((err) => {
    console.log(err);
  });
}

async function copyDir(folder, newFolder) {
  fs.promises
    .readdir(folder, { withFileTypes: true })
    .then((dataList) => {
      for (let dataFile of dataList) {
        if (dataFile.isFile()) {
          fs.promises
            .copyFile(
              path.join(folder, dataFile.name),
              path.join(newFolder, dataFile.name)
            )
            .catch((err) => {
              console.log(err);
            });
        } else {
          createFolder(path.join(newFolder, dataFile.name)).then(() => {
            copyDir(
              path.join(folder, dataFile.name),
              path.join(newFolder, dataFile.name)
            );
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// create style file

async function createStyleFile() {
  const folderPath = path.join(__dirname, "styles");
  const bundlePatch = path.join(__dirname, "project-dist", "style.css");

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

// create html

async function createHTML() {
  const componentsPath = path.join(__dirname, "components");
  const templatePath = path.join(__dirname, "template.html");
  const htmlPatch = path.join(__dirname, "project-dist", "index.html");

  content = {};
  let htmlFile = "";

  const stremTemplates = fs.createReadStream(templatePath);

  stremTemplates.on("data", (templData) => {
    htmlFile = templData.toString();
  });
  // console.log(htmlFile)

  fs.promises.readdir(componentsPath, { withFileTypes: true }).then((files) => {
    for (let file of files) {
      if (file.isFile() && path.extname(file.name) == ".html") {
        const filePath = path.join(componentsPath, file.name);
        let templateTeg = path.basename(file.name, path.extname(file.name));
        // console.log(templateTeg);

        fs.readFile(filePath, "utf-8", (err, dataContent) => {
          if (err) throw err;
          content[templateTeg] = dataContent;

          if (htmlFile.includes(templateTeg)) {
            // console.log(templateTeg);

            const streamFiles = fs.createReadStream(templatePath, "utf-8");
            streamFiles.on("data", () => {
              htmlFile = htmlFile
                .toString()
                .replace(`{{${templateTeg}}}`, dataContent);
            });

            streamFiles.on("data", () => {
              fs.promises.writeFile(htmlPatch, htmlFile);
            });
          }
        });
      }
    }
  });
}
