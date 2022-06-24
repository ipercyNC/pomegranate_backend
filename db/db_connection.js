
let { Client } = require('pg');
require('dotenv').config();

let client = new Client({
    connectionString: process.env.DB_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
})


client.connect()
// function init() {
//     client.query("INSERT INTO pomegranate.users (id, username, password, email) " + 
//     "values (1, 'ipercy', 'testing', 'ianpercyor@gmail.com') "
// , (err, rows) => {
//         if (err)
//             throw err;
//         console.log(rows)
//     })
// }
// init()

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//     if (err) throw err;
//     for (let row of res.rows) {
//       console.log(JSON.stringify(row));
//     }
//     client.end();
//   });

function loadAllUsers(callback) {
    return new Promise((resolve, reject) => {
        client.query("SELECT * FROM pomegranate.users", (err, rows) => {
            if (err)
                return reject(err)
            return resolve(rows)
        })
    })
}

async function authenticate(userJson) {
    console.log(userJson)
    const username = userJson.username
    const password = userJson.password
    console.log(username, password)
    console.log(`SELECT * FROM pomegranate.users WHERE username = "${username}" AND password = "${password}";`)
    return new Promise((resolve, reject) => {
        client.query(`SELECT * FROM pomegranate.users WHERE username = '${username}' AND password = '${password}';`,  (err, rows) => {
            if (err)
                return reject(err);
                console.log(rows)
                for (var row of rows.rows) {
                    console.log(row.username, username)
                    console.log(row.password, password)
                    if (row.username == username && row.password == password){
                        resolve(true)
                    }
                }
            return resolve(false)
        })
    })
}

module.exports = { loadAllUsers, authenticate }