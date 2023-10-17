// zip.js
const archiver = require("archiver");
const fs = require("fs");

const output = fs.createWriteStream(__dirname + "/deploy.zip");
const archive = archiver("zip");

output.on("close", function () {
  console.log(archive.pointer() + " total bytes");
  console.log("Archiver has been finalized and the output file descriptor has closed.");
});

archive.on("error", function (err) {
  throw err;
});

archive.pipe(output);

// Add files & directories
archive.file("package.json", { name: "package.json" });
archive.file("package-lock.json", { name: "package-lock.json" });
// archive.glob("node_modules/**/*");

// Ensure to add transpiled JS files and other necessary files
// archive.glob('dist/**/*');
archive.directory(".rollup/", false);

archive.finalize();
