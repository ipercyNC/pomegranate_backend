
let { Client } = require('pg');
require('dotenv').config();

let client = new Client({
    connectionString: process.env.DB_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
})


client.connect()
function init() {
    client.query("INSERT INTO pomegranate.calendar_events(user_id, date, note, created, updated) " + 
    " VALUES (1, '2022-08-30', 'Buy Diapers', NOW(), NOW());"

, (err, rows) => {
        if (err)
            throw err;
        console.log(rows)
    })
}


// init()

// client.query('SELECT * from pomegranate.calendar_events;', (err, res) => {
//     if (err) throw err;
//     for (let row of res.rows) {
//       console.log(JSON.stringify(row));
//     }
//     client.end();
//   });

async function loadAllUsers(callback) {
    return new Promise((resolve, reject) => {
        client.query("SELECT * FROM pomegranate.users", (err, rows) => {
            if (err)
                return reject(err)
            return resolve(rows)
        })
    })
}

async function loadAllAccounts(userJson) {
    const username = userJson.username
    console.log("hey", username)
    return new Promise((resolve, reject) => {
        client.query(    `SELECT * FROM pomegranate.accounts as acc JOIN pomegranate.users as users ON users.id = acc.user_id 
        WHERE users.username = '${username}'
        `, (err, rows) => {
            console.log(err)
            if (err)
                return reject(err)
            return resolve(rows)
        })
    })

}

async function loadAllCalendarEvents(userJson) {
    const username = userJson.username
    return new Promise((resolve, reject) => {
        client.query(    `SELECT * FROM pomegranate.calendar_events as ce JOIN pomegranate.users as users ON users.id = ce.user_id 
        WHERE users.username = '${username}'
        `, (err, rows) => {
            console.log(err)
            if (err)
                return reject(err)
            return resolve(rows)
        })
    })

}

async function update(account, updateValue) {
    return new Promise((resolve, reject) => {
        client.query(`INSERT INTO pomegranate.accounts (id, user_id, account_name, amount_remaining) VALUES (DEFAULT, 1, '${account}', ${updateValue} ) 
                ON CONFLICT (user_id, account_name) DO UPDATE SET amount_remaining = ${updateValue}`, (err, rows) => {
            if (err)
                return reject(false)
            return resolve(true)
        })
    })
}

async function authenticate(userJson) {
    console.log(userJson)
    const username = userJson.username
    const password = userJson.password
    return new Promise((resolve, reject) => {
        client.query(`SELECT * FROM pomegranate.users WHERE username = '${username}' AND password = '${password}';`,  (err, rows) => {
            if (err)
                return reject(err);
                for (var row of rows.rows) {
                    if (row.username == username && row.password == password){
                        console.log("Username and password match")
                        return resolve(true)
                    }
                }
            console.log("No Username and password match")
            return resolve(false)
        })
    })
}

module.exports = { loadAllUsers, authenticate, update, loadAllAccounts, loadAllCalendarEvents }