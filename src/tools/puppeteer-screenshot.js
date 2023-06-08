'use strict';  

const puppeteer = require('puppeteer');
const fs = require('fs/promises');
// const http = require('http');
const hostname = 'http://localhost:3000'; //'https://image-menu.vercel.app';
const viewWidth = 1280;
const viewHeight = 2000;

// Read the JSON file
const readMyFile = async (filePath) => {
    return fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          return;
        }
        try {
          // Use the JSON data as needed
          return data;
        } catch (err) {
          console.error('Error parsing JSON:', err);
        }
    });
};

// @TODO Start a server here before invoking puppeteer so we dont have to start one seperatly.
// const server = http.createServer((req, res) => res.end('Hi'))
//   .listen(3000, async () => {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     try {
//         await page.goto(hostname);
//     } catch (err) {
//         console.log(err);
//     }

//     console.log('Done');
//     browser.close();
//     server.close();
//   });

/**
 * Use puppeteer to start a headless Chrome and take screenshots of our menus.
 * More info: https://screenshotone.com/blog/how-to-take-a-screenshot-with-puppeteer/
 */
puppeteer
  .launch({
    defaultViewport: {
      width: viewWidth,
      height: viewHeight,
    },
  })
  .then(async (browser) => {
    const data = await readMyFile('../data.json');
    const menus = JSON.parse(data);
    return { menus, browser };
  })
  .then(async ({ menus, browser }) => {
    const screenshots = menus.map(async (menu) => {
        const id = menu.companyId;
        const name = menu.companyName;
        const target = `${hostname}/?id=${id}&print=true`;
        const screenShotPath = `screenshots/menubee-${name}-${id}.png`;
        const page = await browser.newPage();
        // console.log('@@ goto', target, name);
        await page.setViewport({ width: viewWidth, height: viewHeight, deviceScaleFactor: 2 });
        await page.goto(target, {
          timeout: 15 * 1000,
          waitUntil: ['domcontentloaded'],
        });
        // wait 2 seconds just to make sure everything loaded
        await new Promise(r => setTimeout(r, 2000));
        return page.screenshot({ path: screenShotPath, fullPage: true, captureBeyondViewport: false });
    });
    // Wait for all screenshots to be taken then shutdown
    await Promise.all(screenshots);
    await browser.close();
  });
