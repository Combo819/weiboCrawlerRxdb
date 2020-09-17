import puppeteer from 'puppeteer-core';

const testPuppeteer = async  () => {
    const browser = await puppeteer.launch({ product: "chrome",executablePath:"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"});
    const page = await browser.newPage();
    await page.goto('https://baidu.com');
    await page.screenshot({path: 'example.png'});
  
    await browser.close();
  }


  export {testPuppeteer};