const archiver = require("archiver");
const fs = require("fs");

async function archiveBuild() {
  try {
    if (!fs.existsSync(__dirname + "/dist")) {
      fs.mkdirSync(__dirname + "/dist");
    }

    const output = fs.createWriteStream(__dirname + "/dist/deploy.zip");
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
    const packageJSON = await updatePackageJSON();
    archive.append(packageJSON, { name: "package.json" });
    archive.file("package-lock.json", { name: "package-lock.json" });

    archive.directory(".rollup/", false);

    archive.finalize();
  } catch (error) {
    console.log(error);
  }
}

async function updatePackageJSON() {
  return new Promise((res, rej) => {
    fs.readFile("package.json", "utf8", (err, data) => {
      if (err) {
        rej(`Error reading the file: ${err}`);
      }

      const jsonObject = JSON.parse(data);
      jsonObject.main = "httpTrigger.js";

      res(JSON.stringify(jsonObject, null, 2));
    });
  });
}

archiveBuild();