const express = require('express')
const { append } = require('express/lib/response')
const router = express.Router()
const mainPuppeteer = require('../browser/mainPuppeteer')
const db = require('../db/db_connection')


router.use((req, res, next) => {
    console.log("Time: ", Date.now())
    next()
})

router.get("/", (req, res) => {
    res.send("Welcome to the main page")
})

router.post("/connect", async (req, res) => {
    console.log(req.body)
    var value = await mainPuppeteer.connect()

    if (value !== "") {
        console.log("value found" )
        var number = Number(value.replace(/[^0-9.-]+/g,""));
        var result = await db.update(number)
        console.log(result)
    }
    else{
        console.log("value not found")
    }

})

router.get("/load", async (req, res) => {
    var rows = await db.loadAllUsers()
    console.log("rows", rows.rows)
    res.send(rows)
})

router.post("/login", async (req, res) => {
    var authRes = await db.authenticate(req.body)
    console.log("Connected!", authRes)
})

module.exports = router