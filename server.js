// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
var cors = require('cors');
var md5 = require("md5")
var bodyParser = require("body-parser");


// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// CUSTOMERS API
app.get("/api/customers", (req, res, next) => {
    var sql = "select * from customer"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get('/api/customers/:id', (req, res, next) => {
    var sql = "select * from customer where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

app.post("/api/customers/", (req, res, next) => {
    var data = {
        name: req.body.name,
        address: req.body.address,
        phone : req.body.phone
    }
    var sql ='INSERT INTO customer (name, address, phone) VALUES (?,?,?)'
    var params =[data.name, data.address, data.phone]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

//UPDATE
app.patch("/api/customers/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        address: req.body.address,
        phone : req.body.phone
    }
    db.run(
        `UPDATE customer set 
           name = COALESCE(?,name), 
           address = COALESCE(?,address), 
           phone = COALESCE(?,phone) 
           WHERE id = ?`,
        [data.name, data.address, data.phone, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})
// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

