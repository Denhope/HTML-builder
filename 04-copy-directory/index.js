const fs = require("fs");
const path = require("path");

const srsOrigPath = path.join(__dirname, "files");
const srsCopyPath = path.join(__dirname, "files-copy");

main();

async function main() {
  await updateFolder();
  await copyDir(srsOrigPath, srsCopyPath);
  await createFolder(srsCopyPath);
}

async function updateFolder() {
  return fs.promises
    .rm(srsCopyPath, { recursive: true, force: true })
    .then(() => fs.promises.mkdir(srsCopyPath));
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
