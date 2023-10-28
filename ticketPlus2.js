const cheerio = require("cheerio");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const Ddddocr = require('ddddocr');

async function main(){
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'], 
        headless: false,
        args: [`--window-size=${1000},${750}`]
    });
    const mainPage1 = await browser.newPage();
    const mainPage2 = await browser.newPage();
    await mainPage1.setRequestInterception(true);
    await mainPage2.setRequestInterception(true);
    mainPage1.on('request', request => {
        if (request.resourceType() === 'image') {
          request.abort();
        } else {
          request.continue();
        }
    });
    mainPage2.on('request', request => {
        if (request.resourceType() === 'image') {
          request.abort();
        } else {
          request.continue();
        }
    });
    mainPage1.on('dialog', async dialog => {
        log=dialog.message();
        await dialog.accept();
    });

    await mainPage2.goto('https://ticketplus.com.tw', { waitUntil: 'domcontentloaded' });
    await mainPage2.waitForSelector('button.v-btn.v-btn--outlined.v-btn--rounded');
    await mainPage2.click('button.v-btn.v-btn--outlined.v-btn--rounded');
    await mainPage2.waitForSelector('input[type=password]');
    await mainPage2.waitForTimeout(500);
    await mainPage2.type('input.input-tel__input', '');
    await mainPage2.type('input[type=password]', '');
    await mainPage2.waitForTimeout(5000);
    await mainPage1.goto('https://ticketplus.com.tw/order/c752489ad3e922cbd8943deccdd22696/f985a29962a5b0072d835d6e70190183', { waitUntil: 'domcontentloaded' });
    //await mainPage1.goto('https://ticketplus.com.tw/order/6cd9812886feddecc4c4418b964301c3/bda6f9217fa64449830bb48e655ba4b3', { waitUntil: 'domcontentloaded' });
    //await mainPage1.waitForTimeout(000);

    /*boolTime=0;
    while(boolTime==0){
        const now = new Date();
        //const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();
        if(second==0&&minute==0)
            boolTime=1;
    }
    await mainPage1.goto('https://ticketplus.com.tw/order/c752489ad3e922cbd8943deccdd22696/f985a29962a5b0072d835d6e70190183', { waitUntil: 'domcontentloaded' });*/
    //await mainPage1.goto('https://ticketplus.com.tw/order/6cd9812886feddecc4c4418b964301c3/bda6f9217fa64449830bb48e655ba4b3', { waitUntil: 'domcontentloaded' });
    await mainPage1.waitForSelector('.v-item-group .v-expansion-panel', {visible: true});
    await mainPage1.click('.v-item-group .v-expansion-panel');
    await mainPage1.waitForSelector('.v-expansion-panel-content__wrap .v-icon.notranslate.mdi.mdi-plus', {visible: true});
    count=1;
    while(count<=4){
        await mainPage1.click('.v-expansion-panel-content__wrap .v-icon.notranslate.mdi.mdi-plus');
        count++;
    }
    await mainPage1.waitForTimeout(0);
    let form = await mainPage1.$(".captcha-img");
    form.screenshot({
        path:'./form.png'
    });
    await mainPage1.waitForTimeout(100);
    var verifyCode = "";
    var imgDir = "./form.png";
    Ddddocr.create().then(async ddddocr => { 
        verifyCode = await ddddocr.classification(imgDir); 
        console.log(verifyCode);
    });
    await mainPage1.waitForTimeout(150);
    await mainPage1.type('.recaptcha-area input', verifyCode);
    await mainPage1.waitForSelector('button.nextBtn');
    await mainPage1.click('button.nextBtn');
}
//for(i=1; i<=2; i++)
main();
