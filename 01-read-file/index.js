const fs = require("fs");
const patch = require("path");

const stream = fs.createReadStream(patch.join(__dirname, "text.txt"), "utf8");

stream.on("data", (data) => console.log(data));
stream.on("error", (err) => {
  if (err.code == "ENOENT") {
    console.log("Файл не найден");
  } else {
    console.error(err);
  }
});
