const fs = require("fs");
const path = require("path");

const writeFile = path.join(__dirname, "newfile.txt");
const stream = fs.createWriteStream(writeFile);

process.stdout.write("Hi! Tell me plese any words\n");

process.stdin.on("data", (data) => {
  if (data.toString().trim() === "exit") {
    exitFunc();
  }
  stream.write(data);
});

process.on("SIGINT", () => {
  exitFunc();
});

let exitFunc = () => {
  process.stdout.write("Thanks for yor answer. Good bye");
  stream.close();
  process.exit();
};
