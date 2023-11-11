require("dotenv").config();
const { exec } = require("child_process");

const arguments = process.argv.slice(2);
const envArgs = arguments.filter((env) => env.toLowerCase() === "prod" || env.toLowerCase() === "dev");
if (envArgs.length === 0) throw new Error("Environment required, -- prod || -- dev");
if (envArgs.length > 1) throw new Error("Multiple environments passed");

const environment = envArgs[0].toUpperCase();

const resourceGroup = process.env[`RESOURCE_GROUP_${environment}`];
const appName = process.env[`APP_NAME_${environment}`];

if (!resourceGroup || !appName) throw new Error("Resource group and app name required");

// Log in to Azure CLI
exec("az login", (error, stdout, stderr) => {
  // Handle error...

  // Deploy function app via Zip Deploy
  exec(
    `az functionapp deployment source config-zip --resource-group ${resourceGroup} --name ${appName} --src deploy.zip`,
    (error, stdout, stderr) => {
      // Handle error...
      console.log({ resourceGroup, appName });
      console.log(error);
      console.log(stderr);
      console.log(stdout);
      console.log("Deployment Completed!");
    }
  );
});
