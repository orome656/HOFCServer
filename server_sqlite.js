var express = require('express');
var app = express();
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('database_hofc.db');
//var schedule = require('node-schedule');
var CronJob = require('cron').CronJob
var parser = require('./parser_node_module.js');
var winston = require("winston");

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({ filename: './server.log', level: 'debug' })
    ]
});
/**
 * Defining loggers
 */
//winston.add(winston.transports.File, { filename: './server.log', level: 'debug'});
//winston.remove(winston.transports.Console);


//var j = schedule.scheduleJob('*/10 * * * *', function(){
//    logger.info('Launching Database Update');
//    parser.updateDatabase(db);
//});

var job = new CronJob('* */15 * * * *', function(){
      logger.info('Launching Database Update');
      parser.updateDatabase(db);
  }, function () {
    
  },
  true /* Start the job right now */
);

app.get('/classement', function(req, res){
	logger.info('Classement Request');
    db.all('select * from classement', function (err, results) {
        res.send(results);
    });
});

app.get('/calendrier', function(req, res){
	logger.info('Calendrier Request');
    db.all('select * from calendrier', function (err, results) {
        res.send(results);
    });
});

app.get('/actus', function(req, res){
	logger.info('Actus Request');
    db.all('select * from actus', function (err, results) {
        res.send(results);
    });
});

app.listen(3000);