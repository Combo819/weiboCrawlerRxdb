import readlineSync from "readline-sync";
import path from "path";
import _ from "lodash";
import { getTokenByPuppeteer } from "../../browser";
import { credentialJsonPath } from "../../config";
const fs = require("fs");

interface ParsedConfigs {
  cookie: string;
  users: string[];
}
async function getCredentialFile() {
  if (!fs.existsSync(credentialJsonPath)) {
    const { cookie, users } = await createNewJson();

    return { cookie, users };
  } else {
    const rawData: string = fs
      .readFileSync(credentialJsonPath)
      .toString("utf-8");
    try {
      const parsedConfigs: ParsedConfigs = JSON.parse(rawData);
      let {  cookie, users } = parsedConfigs;
      console.log(parsedConfigs, "parsedConfigs");
      if (!cookie) {
        cookie = (await reviseCookie(users)).cookie;
      }
      if (!users || !users.length) {
        users = (await reviseUsers(cookie)).users;
      }
      return { cookie, users };
    } catch (err) {
      const { cookie, users } = await createNewJson();
      return { cookie, users };
    }
  }
}
async function createNewJson():Promise<{cookie:string,users:string[]}> {
  if (
    readlineSync.keyInYN(
      `\ncan not find a credential.json file or the file is invalid to provide the weibo cookie and user list, do you want to create one? credential.json`
    )
  ) {
    const usersStr = readlineSync.question(
      '\nplease provide your weibo usernames that you want to listen the direct messages from, separete them by ",". For example VanDarkHolme,BillyHerrington. \n'
    );
    const users = _.chain(usersStr)
      .trim()
      .replace("@", "")
      .replace("，", ",")
      .value()
      .split(",");
    console.log(users);
    const index = readlineSync.keyInSelect(
      ["browser", "copy and paste"],
      "\nHow do you want to get the weibo cookie? "
    );

    if (index === 0) {
      const cookie: string = await getTokenByPuppeteer();
      saveJson(cookie, users);
      return { cookie, users };
    } else if (index === 1) {
      const cookie: string = readlineSync.question(
        "\nplease copy and paste your cookie here. ref: https://github.com/dataabc/weiboSpider/blob/master/docs/cookie.md: \n"
      );
      if (!cookie.length) {
        console.log("cookie should not be empty");
        throw new Error('cookie should not be empty')
      }
      saveJson(cookie, users);
      return { cookie, users };
    } else {
      throw new Error(`Cancelled`);
    }
  } else {
    console.log("program terminated.");
    process.exit(1);
  }
  
}

function saveJson(cookie: string, users: string[]) {
  let data = JSON.stringify({ cookie, users: users });
  fs.writeFile(credentialJsonPath, data, (err: Error) => {
    if (err) throw err;
    console.log("Data written to file");
  });
}

async function reviseCookie(users: string[]):Promise<{cookie:string,users:string[]}> {
  const index = readlineSync.keyInSelect(
    ["browser", "copy and paste"],
    "\nHow do you want to get the weibo cookie?  "
  );

  if (index === 0) {
    const cookie: string = await getTokenByPuppeteer();
    saveJson(cookie, users);
    return { cookie, users };
  } else if (index === 1) {
    const cookie: string = readlineSync.question(
      "\nplease copy and paste your cookie here. ref: https://github.com/dataabc/weiboSpider/blob/master/docs/cookie.md \n  "
    );
    if (!cookie.length) {
      console.log("program terminated. 程序结束运行。");
      throw new Error('cookie should not be empty');
    }
    saveJson(cookie, users);
    return { cookie, users };
  } else {
    console.log("program terminated. 程序结束运行。");
    throw new Error('Cancelled')
  }
}

async function reviseUsers(cookie: string):Promise<{cookie:string,users:string[]}> {
  const usersStr = readlineSync.question(
    '\nplease provide your weibo usernames, which you want to list the direct messages from, separate them by "," if they are more than 1. For example VanDarkHolme,BillyHerrington. \n  '
  );
  const users = _.chain(usersStr)
    .trim()
    .replace("@", "")
    .replace("，", ",")
    .value()
    .split(",");
  saveJson(cookie, users);
  return { cookie, users };
}

export { getCredentialFile };
