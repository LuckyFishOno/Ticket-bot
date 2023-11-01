const cheerio = require("cheerio");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
//安装的包，报错，需要 修改 ddddocr/dist/index.js 最后一行为 module.exports = DdddOcr; 
const Ddddocr = require('ddddocr');
// note：/* 及 */ 同時使用在頭跟尾，可將整段變成註解，意思就是註解的區域程式不會執行，"同時拿掉頭尾"即可執行該原先被註解區域程式碼
// note：雙斜線 // 表示為單行註解

async function main(){
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
        headless: false, //拿掉機器人標頭
        args: [`--window-size=${1000},${750}`] //瀏覽器視窗設定
    });
    const mainPage1 = await browser.newPage(); //用於購票
    const mainPage2 = await browser.newPage(); //用於登入
    //取消載入圖片，減少載入時間，由於遠大驗證碼並非單純 image，因此不影響
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
    //拿掉談出警訊視窗，如果有
    mainPage1.on('dialog', async dialog => {
        log=dialog.message();
        await dialog.accept();
    });

    await mainPage2.goto('https://ticketplus.com.tw', { waitUntil: 'domcontentloaded' });
    await mainPage2.waitForSelector('button.v-btn.v-btn--outlined.v-btn--rounded');
    await mainPage2.click('button.v-btn.v-btn--outlined.v-btn--rounded');
    await mainPage2.waitForSelector('input[type=password]');
    await mainPage2.waitForTimeout(500);
    await mainPage2.type('input.input-tel__input', 'XXX'); //鍵入電話
    await mainPage2.type('input[type=password]', 'XXX'); //鍵入密碼
    await mainPage2.waitForTimeout(5000); //五秒時間，手動調整電話區域再按登入，不足可更改為10000(10秒)
    await mainPage1.goto('https://ticketplus.com.tw/order/c752489ad3e922cbd8943deccdd22696/f985a29962a5b0072d835d6e70190183', { waitUntil: 'domcontentloaded' });
    //await mainPage1.goto('https://ticketplus.com.tw/order/6cd9812886feddecc4c4418b964301c3/bda6f9217fa64449830bb48e655ba4b3', { waitUntil: 'domcontentloaded' });

    /*
    //時間到自動刷票
    boolTime=0;
    while(boolTime==0){ 
        const now = new Date();
        //const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();
        if(second==0&&minute==0) //秒：second，分：minute，00:00 以 0:0 做比對
            boolTime=1;
    }
    */

    buy=1;
    times=1;
    check: while(buy==1){
        await mainPage1.goto('https://ticketplus.com.tw/order/c752489ad3e922cbd8943deccdd22696/f985a29962a5b0072d835d6e70190183', { waitUntil: 'domcontentloaded' });
        //await mainPage1.goto('https://ticketplus.com.tw/order/6cd9812886feddecc4c4418b964301c3/bda6f9217fa64449830bb48e655ba4b3', { waitUntil: 'domcontentloaded' });
        await mainPage1.waitForSelector('.v-item-group .v-expansion-panel', {visible: true});
        await mainPage1.click('.v-item-group .v-expansion-panel');
        //用於選擇要哪個購票欄位，no tab no enter 第一個，one tab one enter 第二個，two tab one enter 第三個
        //await mainPage1.keyboard.press('Tab');
        //await mainPage1.keyboard.press('Tab');
        //await mainPage1.keyboard.press('Tab');
        //await mainPage1.keyboard.press('Enter');
        //爬所選區域剩餘票數
        soldOut = "default";
        html = await mainPage1.content();
        $ = cheerio.load(html);
        soldOut = $(".v-item--active small").text();
        soldOut = soldOut.replace(/\r\n|\n/g,"");
        soldOut = soldOut.replace(/\s+/g, "");
        console.log(times++)
        console.log("----- "+soldOut+" -----")
        //判斷剩餘票數是否為0，非0以外就重整
        if(soldOut!="剩餘0"){
            count=1;
            while(count<=4){
                await mainPage1.waitForSelector('.v-item--active .v-icon.notranslate.mdi.mdi-plus', {visible: true});
                await mainPage1.click('.v-item--active .v-icon.notranslate.mdi.mdi-plus');
                count++;
            }
            buy=0;
        } else{
            await mainPage1.waitForTimeout(200);
            continue check;
        }
    }

    //await mainPage1.waitForTimeout(0);
    verify=1;
    /*
    while(verify==1){
        //截圖用來等等做驗證
        let form = await mainPage1.$(".captcha-img");
        form.screenshot({ 
            path:'./form.png' 
        });
        await mainPage1.waitForTimeout(100);
        var verifyCode = "";
        var imgDir = "./form.png";
        //ocr AI驗證碼驗證，正確率1/4
        Ddddocr.create().then(async ddddocr => { 
            verifyCode = await ddddocr.classification(imgDir); 
            console.log(verifyCode);
        });
        */
        //await mainPage1.waitForTimeout(150); //避免bug
        await mainPage1.type('.recaptcha-area input', "zspj"); //放入 verifyCode 或直接指定驗證碼輸入
        await mainPage1.waitForSelector('button.nextBtn');
        await mainPage1.click('button.nextBtn');
        /*
        //判斷辨識驗證法是否錯誤，若錯誤更換驗證碼
        error = "";
        html = await mainPage1.content();
        $ = cheerio.load(html);
        error = $(".v-text-field__details").text();
        if(error=="此欄位為必填")
            verify = 1;
        else
            verify = 0;
            await mainPage1.waitForTimeout(50);
    }
    */
    console.log("Success");
    console.log("Success");
    console.log("Success");
}

main();
