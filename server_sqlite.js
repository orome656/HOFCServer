var express = require('express');
var app = express();
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('database_hofc.db');

app.get('/classement', function(req, res){
    db.all('select * from classement', function (err, results) {
        res.send(results);
    });
});

app.get('/calendrier', function(req, res){
    db.all('select * from calendrier', function (err, results) {
        res.send(results);
    });
});

app.get('/actus', function(req, res){
    db.all('select * from actus', function (err, results) {
        res.send(results);
    });
});

app.listen(3000);