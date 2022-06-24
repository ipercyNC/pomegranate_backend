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

router.post("/connect", (req, res) => {
    console.log(req.body)
    mainPuppeteer.connect()
    res.send("Time to connect")
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