var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE customer (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, 
            address TEXT,
            phone TEXT
            )`,
        (err) => {
            if (err) {
                // Table users already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO customer (name, address, phone) VALUES (?,?,?)'
                db.run(insert, ["Mark Benson",
                "353 Rochester St, Rialto FL 43250", "555-534-2342"])
                db.run(insert, ["Bob Smith",
                "215 Market St, Dansville CA 94325", "555-534-2343"])
                db.run(insert, ["John Draper",
                "890 Main St, Fontana IL 31450", "555-534-2344"])
            }
        });  
        db.run(`CREATE TABLE product (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, 
            price NUMERIC
            )`,
        (err) => {
            if (err) {
                // Table users already created
            } else {
                // Table just created, creating some rows
                db.run(`INSERT INTO product (name, price) VALUES ("Parachute Pants", 19.99)`)
                db.run(`INSERT INTO product (name, price) VALUES ("Phone Holder", 9.99)`)
                db.run(`INSERT INTO product (name, price) VALUES ("Pet Rock", 5.99)`)
            }
        })
        db.run(`CREATE TABLE invoice (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER, 
            discount NUMERIC,
            total NUMERIC
            )`,
        (err) => {
            if (err) {
                // Table invoices already created
            }
        })
        db.run(`CREATE TABLE item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_id INTEGER, 
            product_id INTEGER,
            quantity NUMERIC
            )`,
        (err) => {
            if (err) {
                // Table items already created
            }
        })
    }
});


module.exports = db