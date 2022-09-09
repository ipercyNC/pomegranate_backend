const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

function connect() {
    var value = ""    // puppeteer usage as normal
    return new Promise((resolve, reject) => {
        puppeteer.launch({ headless: true, 'defaultViewport': { 'width': 1024, 'height': 1600 } }).then(async browser => {
            console.log('Connecting to NW Natural...')
            const page = await browser.newPage()
            await page.goto('https://nwnatural.com')
            await page.waitForTimeout(5000)
            const button = await page.waitForXPath('//*[@id="nav"]/div[2]/form/button');

            console.log("here")
            if (button) {
                await button.click();
            } else {
                throw new Error("Link not found");
            }

            await page.waitForTimeout(5000)
            await page.screenshot({ path: 'nw0.png', fullPage: true })
            const usernameInput = await page.waitForSelector('input[name="Username"')
            const passwordInput = await page.waitForSelector('input[name="Password"')
            const submitButton = await page.waitForSelector('button[data-testingid="signInButton"]')
            console.log("here1")
            if (usernameInput && passwordInput) {
                await page.type('input[name="Username"', "ianlaurapercy@gmail.com")
                await page.type('input[name="Password"', "0ybXWSc6Su2d8yvcUZ51")
                await submitButton.click()
            } else {
                throw new Error("no input forms")
            }

            await page.waitForTimeout(60000)
            await page.screenshot({ path: 'nw1.png', fullPage: true })
            const amountDue = await page.waitForXPath('//h1[contains(text(), "$")]', { visible: true })
            const signOutButton = await page.waitForXPath('//button[contains(text(), "Sign Out")]', { visible: true })
            console.log('here2');
            // console.log(signOutButton)
            if (amountDue) {
                value = await amountDue.evaluate(el => el.textContent);
                console.log("value", value)
                await signOutButton.click()
            }
            console.log("okay?", value)
            await page.waitForTimeout(20000)
            await browser.close()
            console.log("ugh")
            return resolve(value)
        })
       
    })
}

module.exports = { connect }