const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
function connect() {
    var value = ""    // puppeteer usage as normal
    return new Promise((resolve, reject) => {
        puppeteer.launch({ headless: true, 'defaultViewport': { 'width': 1024, 'height': 1600 } }).then(async browser => {
            console.log('Running Clark Waste Water...')
            const page = await browser.newPage()
            await page.goto('https://crwwd.merchanttransact.com/Login')
            await page.waitForTimeout(5000)
            // await page.screenshot({ path: 'clarkww0.png', fullPage: true })
            const usernameInput = await page.waitForSelector('#Username')
            const passwordInput = await page.waitForSelector('#Password')
            const submitButton = await page.waitForSelector('#submit-button')
            if (usernameInput && passwordInput) {
                await page.type('#Username', "ianlaurapercy@gmail.com")
                await page.type('#Password', "oprxlrNMCDzO017pYZ1s")
                await submitButton.click()
            } else {
                throw new Error("no input forms")
            }

            await page.waitForTimeout(20000)
            // await page.screenshot({ path: 'clarkww1.png', fullPage: true })
            const amountDue = await page.waitForSelector('body > main > div > div > div:nth-child(3) > div.col-lg-7.mt-2 > div > div.card-body.pt-2.pb-2 > div > div.col-auto.h3.mb-0.pr-1', { visible: true })
            const signOutMenu = await page.waitForSelector('#navbarDropdownMenuLink', { visible: true })
            if (amountDue) {
                value = await amountDue.evaluate(el => el.textContent);
                console.log(value)
                await signOutMenu.click()
                const signOutButton = await page.waitForSelector('#navbarNavAltMarkup > div.navbar-nav.flex-row.d-none.d-lg-flex.pt-2.pb-2.ml-md-auto > div > div > a:nth-child(2)', { visible: true })
                await signOutButton.click()
            }
            await page.waitForTimeout(20000)
            await browser.close()
            return resolve(value)
        })
    })
}
module.exports = { connect }