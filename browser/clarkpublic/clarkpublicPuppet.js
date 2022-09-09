const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
function connect() {
    var value = ""    // puppeteer usage as normal
    return new Promise((resolve, reject) => {
        puppeteer.launch({ headless: true, 'defaultViewport': { 'width': 1024, 'height': 1600 } }).then(async browser => {
            console.log('Connecting to Clark Public...')
            const page = await browser.newPage()
            await page.goto('https://www.clarkpublicutilities.com/')
            await page.waitForTimeout(5000)
            await page.screenshot({ path: 'clark0.png', fullPage: true })
            const usernameInput = await page.waitForSelector('#username')
            const passwordInput = await page.waitForSelector('#password')
            const submitButton = await page.waitForSelector('#myaccount-login > div.submit > input[type=submit]')
            if (usernameInput && passwordInput) {
                await page.type('#username', "ianlaurapercy@gmail.com")
                await page.type('#password', "TY0PrAJUUl1ChsCCPXcB")
                await submitButton.click()
            } else {
                throw new Error("no input forms")
            }

            await page.waitForTimeout(20000)
            await page.screenshot({ path: 'clark1.png', fullPage: true })
            const amountDue = await page.waitForSelector('#main > ui-view > ui-view > div.table2.ng-scope > div:nth-child(4) > div.table-cell-right.ng-binding', { visible: true })
            const signOutButton = await page.waitForSelector('#mastheadLogout > a', { visible: true })

            if (amountDue) {
                value = await amountDue.evaluate(el => el.textContent);
                await signOutButton.click()
            }
            await page.waitForTimeout(20000)
            await browser.close()
            return resolve(value)
        })
    })
}
module.exports = { connect }