const express = require('express')
const { append, cookie } = require('express/lib/response')
const { reset } = require('nodemon')
const jwt = require('jsonwebtoken')
const router = express.Router()
const nwnaturalPuppet = require('../browser/nwnatural/nwnaturalPuppet')
const wasteconnectionsPuppet = require('../browser/wasteconnections/wasteConnectionsPuppet')
const clarkpublicPuppet = require('../browser/clarkpublic/clarkpublicPuppet')
const clarkwastewaterPuppet = require('../browser/clarkwastewater/clarkwastewaterPuppet')
const db = require('../db/db_connection')
require('dotenv').config();
var CryptoJS = require("crypto-js");
var data = "0ybXWSc6Su2d8yvcUZ51";
const _ = require('lodash');

// var encrypted = CryptoJS.AES.encrypt(data, process.env.SECRET);
// console.log(encrypted.toString());

// var decrypted = CryptoJS.AES.decrypt("U2FsdGVkX1+gPJfsqEL/OOzgm3W7UrQxb8n127pDa5pbAxhKYsn0uTBZW161xE/T", process.env.SECRET);
// var object = decrypted.toString(CryptoJS.enc.Utf8);
// console.log(object)



router.use((req, res, next) => {
    console.log("Time: ", Date.now())
    next()
})

router.get("/", (req, res) => {
    res.send("Welcome to the main page")
})

router.post("/connect", async (req, res) => {
    var accountsUpdated = 0
    var nwnaturalValue = await nwnaturalPuppet.connect()
    if (nwnaturalValue !== "") {
        console.log("Value found", nwnaturalValue)
        var number = Number(nwnaturalValue.replace(/[^0-9.-]+/g,""));
        try {
            var result = await db.update("NW NATURAL", number)
            console.log("nw natural updated succesful? ", result)
            accountsUpdated += 1
        }
        catch (err) {
            console.log("Error inserting into DB")
            console.log(err)
        }
    }
    else{
        console.log("value not found")
    }
    var wasteconnectionsValue = await wasteconnectionsPuppet.connect()
    if (wasteconnectionsValue !== "") {
        console.log("Value found", wasteconnectionsValue)
        var number = Number(wasteconnectionsValue.replace(/[^0-9.-]+/g,""));
        try {
            var result = await db.update("WASTE CONNECTIONS", number)
            if (result) {
                accountsUpdated +=1 
            }
        }
        catch (err) {
            console.log("Error inserting into DB")
            console.log(err)
        }
    }
    else{
        console.log("value not found")
    }
    var clarkpublicValue = await clarkpublicPuppet.connect()
    if (clarkpublicValue !== "") {
        console.log("Value found", clarkpublicValue)
        var number = Number(clarkpublicValue.replace(/[^0-9.-]+/g,""));
        try {
            var result = await db.update("CLARK PUBLIC UTILITIES", number)
            if (result) {
                accountsUpdated +=1 
            }
        }
        catch (err) {
            console.log("Error inserting into DB")
            console.log(err)
        }
    }
    else{
        console.log("value not found")
    }
    var clarkwastewaterValue = await clarkwastewaterPuppet.connect()
    if (clarkwastewaterValue !== "") {
        console.log("Value found", clarkwastewaterValue)
        var number = Number(clarkwastewaterValue.replace(/[^0-9.-]+/g,""));
        try {
            var result = await db.update("CLARK WASTE WATER", number)
            if (result) {
                accountsUpdated +=1 
            }
        }
        catch (err) {
            console.log("Error inserting into DB")
            console.log(err)
        }
    }
    else{
        console.log("value not found")
    }
    res.send(JSON.stringify({"updatedAccounts": accountsUpdated}))
})

router.get("/load", async (req, res) => {
    var rows = await db.loadAllUsers()
    console.log("rows", rows.rows)
    res.send(rows)
})

router.post("/loadAllAccounts", async (req, res) => {
    var rows = await db.loadAllAccounts(req.body)
    res.send(JSON.stringify({"results": rows.rows}))
})

router.post("/loadAllCalendarEvents", async (req, res) => {
    console.log("loading calendar events")
    var rows = await db.loadAllCalendarEvents(req.body)
    console.log("rows", rows.rows)
    console.log({"results": rows.rows})
    res.send(JSON.stringify({"results": rows.rows}))
})

router.post("/login", async (req, res) => {
    var authRes = await db.authenticate(req.body)
    if (authRes) {
        console.log("User Authenticated in DB")
        let jwtSecretKey = process.env.JWT_SECRET
        let data = {
            time: Date(), 
            username: req.body.username
        }
        const token = jwt.sign(data, jwtSecretKey)
        console.log(token)
        res.cookie('authToken', token)
        res.send(JSON.stringify({"LoginResult": "Success"})
        )
    } else {
        res.send(JSON.stringify({"LoginResult": "Failure"}))
    }
})
router.post("/verifytoken", async (req, res) => {
    if (req.headers.cookie){
        let cookies = req.headers.cookie.split(';')
        for (ind in cookies){
            let cookieSplit = cookies[ind].split('=')
            let cookieKey = cookieSplit[0]
            let cookieValue = cookieSplit[1]
            console.log("hey", _.isEqual("authToken", cookieKey))
            if (!_.isEqual("authToken", cookieKey)) {
                continue
            }
            const verified = jwt.verify(cookieValue, process.env.JWT_SECRET)
            console.log(verified)
            if (verified) {
                return res.send(JSON.stringify({"VerifyResult": "Success"}))
            }
        }
    }
    return res.send(JSON.stringify({"VerifyResult": "Failure"}))
})

module.exports = router