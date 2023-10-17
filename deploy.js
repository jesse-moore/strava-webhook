require("dotenv").config();
const { exec } = require("child_process");

// Fetch environment variables
const resourceGroup = process.env.RESOURCE_GROUP;
const appName = process.env.APP_NAME;

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
