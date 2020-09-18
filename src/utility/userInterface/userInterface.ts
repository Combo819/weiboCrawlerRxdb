import readlineSync from "readline-sync";
import path from "path";
import _ from "lodash";
import { getTokenByPuppeteer } from "../../browser";
import { promises } from "fs";
const fs = require("fs");

interface ParsedConfigs {
  token: string;
  users: string[];
}
async function getCredentialFile() {
  if (!fs.existsSync(path.resolve(__dirname, "../../../", "credential.json"))) {
    const { cookie, users } = await createNewJson();

    return { cookie, users };
  } else {
    const rawData: string = fs
      .readFileSync(path.resolve(__dirname, "../../../", "credential.json"))
      .toString("utf-8");
    try {
      const parsedConfigs: ParsedConfigs = JSON.parse(rawData);
      let { token: cookie, users } = parsedConfigs;
      console.log(parsedConfigs,'parsedConfigs')
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
async function createNewJson() {
  if (
    readlineSync.keyInYN(
      `can not find a credential.json file or the file is invalid to provide the weibo token and user list, do you want to create one? credential.json`
    )
  ) {
    const usersStr = readlineSync.question(
      'please provide your weibo usernames that you want to listen the direct messages from, separete them by ",". For example VanDarkHolme,BillyHerrington. \n'
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
      "How do you want to get the weibo token? "
    );

    if (index === 0) {
      const chromePath = readlineSync.questionPath(
        `please provide your chrome path: \n`
      );
      const cookie: string = await getTokenByPuppeteer(chromePath.replace(/\\/g, "\\\\"));
      saveJson(cookie, users);
      return { cookie, users };
    } else if (index === 1) {
      const cookie: string = readlineSync.question(
        "please copy and paste your cookie here. ref: https://github.com/dataabc/weiboSpider/blob/master/docs/cookie.md: \n"
      );
      if (!cookie.length) {
        console.log("program terminated. 程序结束运行。");
        process.exit(1);
      }
      saveJson(cookie, users);
      return { cookie, users };
    } else {
      console.log("program terminated.");
      process.exit(1);
    }
  } else {
    console.log("program terminated.");
    process.exit(1);
  }
}

function saveJson(cookie: string, users: string[]) {
  let data = JSON.stringify({ token: cookie, users: users });
  fs.writeFile(
    path.resolve(__dirname, "../../../", "credential.json"),
    data,
    (err: Error) => {
      if (err) throw err;
      console.log("Data written to file");
    }
  );
}

async function reviseCookie(users: string[]) {
  const index = readlineSync.keyInSelect(
    ["browser", "copy and paste"],
    "How do you want to get the weibo token?  "
  );

  if (index === 0) {
    const chromePath = readlineSync.questionPath(
      `please provide your chrome path: \n`
    );
    const cookie: string = await getTokenByPuppeteer(
      chromePath.replace(/\\/g, "\\\\")
    );
    saveJson(cookie, users);
    return { cookie, users };
  } else if (index === 1) {
    const cookie: string = readlineSync.question(
      "please copy and paste your cookie here. ref: https://github.com/dataabc/weiboSpider/blob/master/docs/cookie.md \n  "
    );
    if (!cookie.length) {
      console.log("program terminated. 程序结束运行。");
      process.exit(1);
    }
    saveJson(cookie, users);
    return { cookie, users };
  } else {
    console.log("program terminated. 程序结束运行。");
    process.exit(1);
  }
}

async function reviseUsers(cookie: string) {
  const usersStr = readlineSync.question(
    'please provide your weibo usernames, which you want to list the direct messages from, separete them by "," if they are more than 1. For example VanDarkHolme,BillyHerrington. \n  '
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
