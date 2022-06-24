const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

function connect() {
    // puppeteer usage as normal
    puppeteer.launch({ headless: true, 'defaultViewport' : { 'width' : 1024, 'height' : 1600 }}).then(async browser => {
    console.log('Running tests..')
    const page = await browser.newPage()
    await page.goto('https://nwnatural.com')
    await page.waitForTimeout(5000)
    const button = await page.waitForXPath('//*[@id="nav"]/div[2]/form/button');
    if (button) {
        await button.click();
    } else {
        throw new Error("Link not found");
    }
    await page.waitForTimeout(5000)
    const usernameInput = await page.waitForSelector('input[name="Username"')
    const passwordInput = await page.waitForSelector('input[name="Password"')
    const submitButton = await page.waitForSelector('button[data-testingid="signInButton"]')
    if (usernameInput && passwordInput) {
        await page.type('input[name="Username"', "ianlaurapercy@gmail.com")
        await page.type('input[name="Password"',"0ybXWSc6Su2d8yvcUZ51")
        await submitButton.click()
    } else {
        throw new Error("no input forms")
    }

    await page.waitForTimeout(10000)
    await page.screenshot({ path: 'what.png', fullPage: true })
    const amountDue = await page.waitForSelector('div[class^="AmountDue"]')
    const signOutButton = await page.waitForSelector('button[contains(., "Sign Out")]')
    if (amountDue) {
        const value = await amountDue.evaluate(el => el.textContent);
        console.log(value)
        await signOutButton.click()
    }
    await page.screenshot({ path: 'testresult.png', fullPage: true })
    await browser.close()
    console.log(`All done, check the screenshot`)
    })
}

module.exports = { connect }