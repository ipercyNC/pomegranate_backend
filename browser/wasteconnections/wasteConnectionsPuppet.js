const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
function connect() {
    var value = ""    // puppeteer usage as normal
    return new Promise((resolve, reject) => {
        puppeteer.launch({ headless: true, 'defaultViewport': { 'width': 1500, 'height': 2000 } }).then(async browser => {
            console.log('Connecting to Waste Connections...')
            const page = await browser.newPage()

            await page.goto("https://www.wcicustomer.com/Login.aspx")
            await page.waitForTimeout(5000)
            // await page.screenshot({ path: 'waste0.png', fullPage: true })
            const usernameInput = await page.waitForSelector('input[id="cphMain_txtUserID"]')
            const passwordInput = await page.waitForSelector('input[id="cphMain_txtPassword"]')
            const loginButton = await page.waitForSelector('#btnLogin', { visible: true });
            if (usernameInput && passwordInput) {
                await page.type('input[id="cphMain_txtUserID"]', "ianlaurapercy")
                await page.type('input[id="cphMain_txtPassword"]', "LOpqQt3oIE11HvfDV1Xs")
                await loginButton.click()
            } else {
                throw new Error("no input forms")
            }

            await page.waitForTimeout(15000)
            // await page.screenshot({ path: 'waste1.png', fullPage: true })
            const popup = await page.waitForSelector('a[href="#"]', { visible: true })
            if (popup) {
                await popup.click()
            }
            // await page.screenshot({ path: 'waste2.png', fullPage: true })
            const amountDue = await page.waitForSelector('#lblBalance', { visible: true })
            const signOutButton = await page.waitForSelector('#aLogout', { visible: true })
            // await page.screenshot({ path: 'waste3.png', fullPage: true })
            if (amountDue) {
                value = await amountDue.evaluate(el => el.textContent);
                console.log("value inside", value)
                await signOutButton.click()

            }
            await page.waitForTimeout(20000)
            await browser.close()
            return resolve(value)
        })
    })
}

module.exports = { connect }