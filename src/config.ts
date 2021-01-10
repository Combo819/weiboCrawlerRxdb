import path from "path";
const fs = require("fs");
const baseUrl: string = "https://m.weibo.cn";

const Q_CONCURRENCY: number = 1;

const staticPath = path.resolve(process.cwd(), "./storage", "static");

if (!fs.existsSync(path)) {
  console.log("creating folder " + staticPath);
  fs.mkdirSync(staticPath, { recursive: true });
}


const credentialJsonPath = path.resolve(process.cwd(), './', 'credential.json');

const rxdbBasePath = path.resolve(process.cwd(), "storage", "rxdb");
if (!fs.existsSync(rxdbBasePath)) {
  console.log("creating folder " + rxdbBasePath);
  fs.mkdirSync(rxdbBasePath, { recursive: true });
}
const rxdbPath = path.resolve(rxdbBasePath, "weibocrawler");


const port = 5000;

export {
  baseUrl,
  Q_CONCURRENCY,
  staticPath,
  port,
  credentialJsonPath,
  rxdbPath
};
