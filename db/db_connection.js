
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
//     client.query("CREATE TABLE pomegranate.accounts ( " + 
//     " id serial PRIMARY KEY,  " + 
//         " user_id INT NOT NULL, " + 
//         "account_name VARCHAR ( 50 ) NOT NULL, " + 
//       "  amount_remaining NUMERIC(5,2), " + 
//       "  FOREIGN KEY (user_id) " + 
//         "   REFERENCES pomegranate.users (id) " + 
//           " );"
    
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

async function loadAllUsers(callback) {
    return new Promise((resolve, reject) => {
        client.query("SELECT * FROM pomegranate.users", (err, rows) => {
            if (err)
                return reject(err)
            return resolve(rows)
        })
    })
}

async function update(updateValue) {
    return new Promise((resolve, reject) => {
        client.query(`INSERT INTO pomegranate.accounts (id, user_id, account_name, amount_due) VALUES (1, 1, 'NW NATURAL', ${updateValue} ) `, (err, rows) => {
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

module.exports = { loadAllUsers, authenticate, update }