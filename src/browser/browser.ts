import puppeteer from "puppeteer-core";
import { URL } from "url";
import _ from "lodash";

const getTokenByPuppeteer:()=>Promise<string> = () => {
  return new Promise( async (resolve, reject) => {
    try{
      const browser:puppeteer.Browser = await puppeteer.launch({
        product: "chrome",
        executablePath:
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        headless: false,
      });
      const page = await browser.newPage();
      await page.goto("https://m.weibo.cn");
      page.on("request", async (request) => {
        const url = new URL(request.url());
        if (url.pathname.endsWith("/feed/friends")) {
          const cookies = await page.cookies();
          let cookiesStr = "";
          Object.values(cookies).forEach((element) => {
            const { name, value } = element;
            cookiesStr += `${name}=${value}; `;
          });
          resolve(_.trim(cookiesStr));
          await page.evaluate(' alert("token get. the browser will be closed") ');
          await browser.close();
        }
      });
    }catch(err){
      reject(err);
    }

  });

  //await browser.close();
};

export { getTokenByPuppeteer };
