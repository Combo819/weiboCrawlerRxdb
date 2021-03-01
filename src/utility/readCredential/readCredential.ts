import _ from "lodash";
import { credentialJsonPath } from "../../config";
const fs = require("fs");

interface ParsedConfigs {
  cookie: string;
  users: string[];
}
async function getCredentialFile() {
  let cookie:string = "";
  let users:string[] = [];
  if (!fs.existsSync(credentialJsonPath)) {
    console.log(`the config json file ${credentialJsonPath} doesn't exist`)
    return  { cookie, users };
  }
  const rawData: string = fs
    .readFileSync(credentialJsonPath)
    .toString("utf-8");
  const parsedConfigs: ParsedConfigs = JSON.parse(rawData);
  cookie = parsedConfigs.cookie;
  users = parsedConfigs.users;
  if (typeof cookie !== "string") {
    console.log(`the cookie doesn't exist or is not string in ${credentialJsonPath}`)
  }
  if (!_.isUndefined(users) && !_.isArray(users)) {
    console.log(`the users in ${credentialJsonPath} should be empty or an array of string`)
  }
  if (_.isUndefined(users)) {
    users = [];
  }
  return { cookie, users };
}

export { getCredentialFile };
