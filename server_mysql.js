var database_username = 'foot';
var database_password = 'foot';
var database_name = 'foot';

var express = require('express');
var app = express();
var mysql = require("mysql");
var connection = mysql.createConnection(
        'mysql://'+database_username+':'+database_password+'@192.168.1.50:3306/'+database_name
);
connection.connect();

app.get('/classement', function(req, res){
    connection.query('select * from classement', function (err, results) {
        res.send(results);
    });
});

app.get('/calendrier', function(req, res){
    connection.query('select * from calendrier', function (err, results) {
        res.send(results);
    });
});

app.get('/actus', function(req, res){
    connection.query('select * from actus', function (err, results) {
        res.send(results);
    });
});

app.listen(3000);
