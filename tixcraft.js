const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

async function main(){
    /*const browser = await puppeteer.launch({
        headless: false,
        //executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
        //executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
    })*/
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({args: ['--no-sandbox'], headless: false});
    const mainPage1 = await browser.newPage();  // 用於拓元
    const mainPage2 = await browser.newPage();  // 用於 google

    //35秒執行
    await mainPage1.goto('https://tixcraft.com');
    await mainPage2.goto('https://tixcraft.com/login/google');
    await mainPage2.type('input[type=text]', '');      // 帳號
    await mainPage2.keyboard.press('Enter');
    //await mainPage1.waitForTimeout(10000);
    await mainPage2.waitForTimeout(2000);   // 用於 google 帳號輸入完案 enter 載入密碼輸入匡的延遲，
    await mainPage2.type('input[type=password]', '');   // 等待中間延遲完輸入密碼，手動 enter
    //await mainPage1.keyboard.press('Enter');

    //mainPage1 先點擊旁邊空白處（後面想輸入驗證碼才不會變輸入網址），等時間準點按重新整理網頁
    await mainPage1.waitForSelector('header div.container a.user-name');    // 等待重新整理完跳出右上角會員之 html 出現用來判斷要不要接著執行下面程式
    //await mainPage1.waitForTimeout(4000);
    await mainPage1.goto('https://tixcraft.com/activity/game/23_yoshimaf');    // 判斷完後跳專此頁面 23_flesh 根據網址手動更改（）
    //await mainPage1.goto('https://tixcraft.com/activity/game/23_fujirock');    // 判斷完後跳專此頁面 23_flesh 根據網址手動更改（）
    await mainPage1.waitForSelector('tr.gridc.fcTxt button');   // 等待買票按鈕 html 出現
    await mainPage1.click('tr.gridc.fcTxt:nth-child(55) button');     // 點擊買票按鈕
    //await mainPage1.waitForSelector('ul.area-list li a');
    //await mainPage1.click('ul.area-list li a');  // 由上往下優先，通常優先最貴的
    //await mainPage1.click('ul.area-list li:nth-child(2) a');  //優先最貴的第幾個 nth-child(x)，盲猜不確定有沒有，不建議
    //await mainPage1.click('ul#group_1 li a');  //客制票種，從最貴到最便宜，group_0 ~ group_n
    //await mainPage1.waitForSelector('select', {visible: true});
    await mainPage1.select('select', '3')   // 選擇幾張
    await mainPage1.waitForSelector('input[type=checkbox]', {visible: true});   // 等待確認勾勾選項 html 出現，確實會親眼看到
    await mainPage1.click('input[type=checkbox]');    // 勾選確認勾勾
    for(var i=0; i<200; i++)
        await mainPage1.focus('input#TicketForm_verifyCode.greyInput');     // 驗證碼輸入匡可以直接輸入，不用再滑鼠先點框框，我也不知道為啥要這樣寫，反正可以
    
    //輸入完驗證碼直接按 enter
}

main();