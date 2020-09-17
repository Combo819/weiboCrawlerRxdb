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
  } else {
    const rawData: string = fs
      .readFileSync(path.resolve(__dirname, "../../../", "credential.json"))
      .toString("utf-8");
    try {
      const parsedConfigs: ParsedConfigs = JSON.parse(rawData);
      let { token: cookie, users } = parsedConfigs;
      if (!cookie) {
      }
      if (!users || !users.length) {
      }
    } catch (err) {
      const { cookie, users } = await createNewJson();
    }
  }
}
async function createNewJson() {
  if (
    readlineSync.keyInYN(
      `can not find a credential.json file or the file is invalid to provide the weibo token and user list, do you want to create one? credential.json 不存在或无效,需要创建一个credential.json文件来提供微博cookie和监听者名单，确定创建吗？`
    )
  ) {
    const usersStr = readlineSync.question(
      'please provide your weibo usernames, which you want to list the direct messages from, separete them by "," if they are more than 1. For example VanDarkHolme,BillyHerrington. \n 请提供你需要监听的微博账号，如果有多个请用英文逗号“,”分隔，比如 VanDarkHolme,BillyHerrington'
    );
    const users = _.chain(usersStr)
      .trim()
      .replace("@", "")
      .replace("，", ",")
      .value()
      .split(",");
    const index = readlineSync.keyInSelect(
      ["browser 通过浏览器", "copy and paste 复制粘贴"],
      "How do you want to get the weibo token? 请问你希望如何获得微博cookie？"
    );

    if (index === 1) {
      const cookie: string = await getTokenByPuppeteer();
      saveJson(cookie, users);
      return { cookie, users };
    } else if (index === 2) {
      const cookie: string = readlineSync.question(
        "please copy and paste your cookie here. ref: baidu.com. \n 请手动将微博的cookie复制到这里，参见：baidu.com"
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
  } else {
    console.log("program terminated. 程序结束运行。");
    process.exit(1);
  }
}

function saveJson(cookie: string, users: string[]) {
  let data = JSON.stringify({ token: cookie, users: users.join(",") });
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
    ["browser 通过浏览器", "copy and paste 复制粘贴"],
    "How do you want to get the weibo token? 请问你希望如何获得微博cookie？"
  );

  if (index === 1) {
    const cookie: string = await getTokenByPuppeteer();
    saveJson(cookie, users);
    return { cookie, users };
  } else if (index === 2) {
    const cookie: string = readlineSync.question(
      "please copy and paste your cookie here. ref: baidu.com. \n 请手动将微博的cookie复制到这里，参见：baidu.com"
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
