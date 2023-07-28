const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

async function main(){
    /*const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
        //executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
    })*/
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({args: ['--no-sandbox'], headless: false});
    const mainPage1 = await browser.newPage();
    const mainPage2 = await browser.newPage();
    const mainPage3 = await browser.newPage();
    //JE5GMHVD
    mainPage1.on('dialog', async dialog => {
        //get alert message
        console.log(dialog.message());
        //accept alert
        await dialog.accept();
    })
    await mainPage3.goto('https://accounts.google.com/');
    await mainPage2.goto('https://teamear.tixcraft.com/login/login');
    await mainPage1.goto('https://teamear.tixcraft.com/activity');
    await mainPage3.type('input[type=text]', '');
    await mainPage3.keyboard.press('Enter');
    //await mainPage1.waitForTimeout(10000);
    await mainPage3.waitForTimeout(2000);
    //await mainPage1.waitForSelector('div.tCpFMc form div.EcjFDf input[type=checkbox], {visible: true}');
    await mainPage3.type('input[type=password]', '');
    await mainPage2.click('div#wrap form.loginForm div.loginBtnList div#customBtn');
    //await mainPage1.keyboard.press('Enter');
    await mainPage1.waitForSelector('header div.container div.col.text-end div.login-user');
    //await mainPage1.waitForTimeout(4000);
    await mainPage1.goto('https://teamear.tixcraft.com/activity/game/23_crowdtp');
    await mainPage1.waitForSelector('tr.gridc.fcTxt button');
    await mainPage1.click('tr.gridc.fcTxt button');
    await mainPage1.type('input.greyInput', 'JE5GMHVD'); //小隊員，手動比較中間(?
    await mainPage1.click('button.btn.btn-primary'); //小隊員，手動比較中間(?
    //await mainPage1.keyboard.press('Enter');    //小隊員，手動比較中間(?
    //await mainPage1.waitForSelector('ul.area-list li a');
    await mainPage1.waitForSelector('ul.area-list li a');
    await mainPage1.click('ul.area-list li a');  //優先VIP
    //await mainPage1.click('ul.area-list li:nth-child(2) a');  //優先VIP
    //await mainPage1.click('ul#group_1 li:nth-child(2) a');  //客制票種
    //await mainPage1.waitForSelector('select', {visible: true});
    await mainPage1.select('select', '2')
    await mainPage1.waitForSelector('input[type=checkbox]', {visible: true});
    await mainPage1.click('input[type=checkbox]');
    for(var i=0; i<200; i++)
        await mainPage1.focus('input#TicketForm_verifyCode.greyInput');

}

main();
