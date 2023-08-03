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
            name text, 
            address text,
            phone text
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
            name text, 
            price DECIMAL,
            )`,
        (err) => {
            if (err) {
                // Table users already created
            }
            // else{
            //     // Table just created, creating some rows
            //     var insert = 'INSERT INTO product (name, price) VALUES (?,?)'
            //     db.run(insert, ["Parachute Pants", DataTypes.DECIMAL(29.99)])
            //     db.run(insert, ["Phone Holder", 9.99])
            //     db.run(insert, ["Pet Rock", 5.99])
            // }
        })
        db.run(`CREATE TABLE invoice (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER, 
            discount DECIMAL,
            total DECIMAL
            )`,
        (err) => {
            if (err) {
                // Table users already created
            }
        })
        db.run(`CREATE TABLE invoice_item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_id INTEGER, 
            product_id INTEGER,
            quantity DECIMAL
            )`,
        (err) => {
            if (err) {
                // Table users already created
            }
        })
    }
});


module.exports = db