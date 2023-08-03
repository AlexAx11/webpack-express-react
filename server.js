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

//DELETE CUSTOMER
app.delete("/api/customers/:id", (req, res, next) => {
    db.run(
        'DELETE FROM customer WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

//PRODUCTS API
app.get("/api/products", (req, res, next) => {
    var sql = "select * from product"
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

app.get('/api/products/:id', (req, res, next) => {
    var sql = "select * from product where id = ?"
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

app.post("/api/products/", (req, res, next) => {
    var data = {
        name: req.body.name,
        price: req.body.price,
    }
    var sql ='INSERT INTO product (name, price) VALUES (?,?)'
    var params =[data.name, data.price]
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
app.patch("/api/products/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        price: req.body.price
    }
    db.run(
        `UPDATE product set 
           name = COALESCE(?,name), 
           price = COALESCE(?,price)
           WHERE id = ?`,
        [data.name, data.price, req.params.id],
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

//DELETE PRODUCT
app.delete("/api/products/:id", (req, res, next) => {
    db.run(
        'DELETE FROM product WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

//INVOICE API
app.get("/api/invoices", (req, res, next) => {
    var sql = "select * from invoice"
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

app.get('/api/invoices/:id', (req, res, next) => {
    var sql = "select * from invoice where id = ?"
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

app.post("/api/invoices/", (req, res, next) => {
    var data = {
        customer_id: req.body.customer_id,
        discount: req.body.discount,
        total: req.body.total
    }
    var sql ='INSERT INTO invoice (customer_id, discount, total) VALUES (?,?,?)'
    var params =[data.customer_id, data.discount, data.total]
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
app.patch("/api/invoices/:id", (req, res, next) => {
    var data = {
        customer_id: req.body.customer_id,
        discount: req.body.discount,
        total: req.body.total
    }
    db.run(
        `UPDATE invoice set 
            customer_id = COALESCE(?,customer_id), 
            discount = COALESCE(?,discount),
            total = COALESCE(?,total)
           WHERE id = ?`,
        [data.customer_id, data.discount, data.total, req.params.id],
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

//DELETE INVOICE
app.delete("/api/invoices/:id", (req, res, next) => {
    db.run(
        'DELETE FROM invoice WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

//INVOICE_ITEM API

app.get('/api/invoices/:invoice_id/items', (req, res, next) => {
    var invoice_id = req.params.invoice_id;
    var sql = "select * from item where invoice_id = ?"
    var params = [invoice_id]
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

app.get('/api/invoices/:invoice_id/items/:id', (req, res, next) => {
    var sql = "SELECT * FROM item WHERE invoice_id = ? AND id = ?";
    var params = [req.params.invoice_id, req.params.id];
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

app.post("/api/items/", (req, res, next) => {
    var data = {
        invoice_id: req.body.invoice_id,
        product_id: req.body.product_id,
        quantity: req.body.quantity
    }
    var sql ='INSERT INTO item (invoice_id, product_id, quantity) VALUES (?,?,?)'
    var params =[data.invoice_id, data.product_id, data.quantity]
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
app.patch("/api/item/:id", (req, res, next) => {
    var data = {
        invoice_id: req.body.invoice_id,
        product_id: req.body.product_id,
        quantity: req.body.quantity
    }
    db.run(
        `UPDATE item set 
            invoice_id = COALESCE(?,invoice_id), 
            product_id = COALESCE(?,product_id),
            quantity = COALESCE(?,quantity)
           WHERE id = ?`,
        [data.invoice_id, data.product_id, data.quantity, req.params.id],
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

//DELETE item
app.delete("/api/items/:id", (req, res, next) => {
    db.run(
        'DELETE FROM item WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})


// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

