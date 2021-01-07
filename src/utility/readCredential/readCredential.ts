import _ from "lodash";
import { credentialJsonPath } from "../../config";
const fs = require("fs");

interface ParsedConfigs {
  cookie: string;
  users: string[];
}
async function getCredentialFile() {
  if (!fs.existsSync(credentialJsonPath)) {
    console.error(`the config json file ${credentialJsonPath} doesn't exist`)
    process.exit(1);
  }
  const rawData: string = fs
    .readFileSync(credentialJsonPath)
    .toString("utf-8");
  const parsedConfigs: ParsedConfigs = JSON.parse(rawData);
  let { cookie, users } = parsedConfigs;
  if (typeof cookie !== "string") {
    console.error(`the cookie doesn't exist or is not string in ${credentialJsonPath}`)
    process.exit(1);
  }
  if (!_.isUndefined(users) && !_.isArray(users)) {
    console.error(`the users in ${credentialJsonPath} should be empty or an array of string`)
    process.exit(1);
  }
  if (_.isUndefined(users)) {
    users = [];
  }
  return { cookie, users };
}

export { getCredentialFile };
