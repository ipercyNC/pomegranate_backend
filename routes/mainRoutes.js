const express = require('express')
const { append } = require('express/lib/response')
const { reset } = require('nodemon')
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
    console.log("okay?")
    var value = await mainPuppeteer.connect()
    // var value = "$49"
    if (value !== "") {
        console.log("Value found", value)
        var number = Number(value.replace(/[^0-9.-]+/g,""));
        try {
            var result = await db.update(number)
            res.send(JSON.stringify(result))
        }
        catch (err) {
            console.log("Error inserting into DB")
            console.log(err)
        }
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

router.post("/loadAllAccounts", async (req, res) => {
    var rows = await db.loadAllAccounts(req.body)
    console.log("rows", rows.rows)
    console.log({"results": rows.rows})
    res.send(JSON.stringify({"results": rows.rows}))
})

router.post("/login", async (req, res) => {
    var authRes = await db.authenticate(req.body)
    // console.log("Connected!", authRes)
    console.log("authres", authRes)
    if (authRes) {
        console.log("1st")
        res.send(JSON.stringify({"status": "okay"})
        )
    } else {
        res.send("no okay")
    }
})

module.exports = router