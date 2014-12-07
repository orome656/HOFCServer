var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('database_hofc.db');
//var schedule = require('node-schedule');
var CronJob = require('cron').CronJob
var parser = require('./parser_node_module.js');
var winston = require("winston");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

var creation_table_notification_query = "CREATE TABLE IF NOT EXISTS `notification_client` (`id` INTEGER PRIMARY KEY AUTOINCREMENT , `uuid` varchar(255) NOT NULL, `notification_id` varchar2(50) NOT NULL)";

//var j = schedule.scheduleJob('*/10 * * * *', function(){
//    logger.info('Launching Database Update');
//    parser.updateDatabase(db);
//});

var job = new CronJob('0 */15 * * * *', function(){
      logger.info('Launching Database Update');
      parser.updateDatabase(db);
  }, function () {
    
  },
  true // Start the job right now 
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

app.post('/parsePage', function(req, res) {
    console.log('url page : ' + req.body.url);
    var url = req.body.url;
    if(url.indexOf('en-images') != -1) {
        console.log('Image Page');
        
        parser.parseDiaporama(url, function(resultats) {
            res.send(resultats);
        });   
    } else {
        parser.parseArticle(url, function(resultats){
            res.send(resultats);
        });   
    }
});

app.post('/registerPush', function(req, res){
	logger.info('New registration ');
    var notificationId = req.body.notification_id;
    var uuid = req.body.uuid;
    if(notificationId && uuid) {
        db.serialize(function () {
            db.run(creation_table_notification_query);
            db.get("SELECT * FROM notification_client where uuid='" + uuid +"'", function(err, result){
                if(err) {
                    logger.info('Error ' + err);
                    return;
                }

                if(result != null) {
                    db.run("UPDATE notification_client set notification_id='"+notificationId+"' WHERE uuid='"+uuid+"'");
                } else {
                    db.run("INSERT INTO notification_client (notification_id, uuid) VALUES ('"+notificationId+"','"+uuid+"')");
                }
            });
        });
    }
    res.send('0');
});

app.listen(3000);