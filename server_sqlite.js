var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('database_hofc.db');
var CronJob = require('cron').CronJob
var parser = require('./parser_node_module.js');
var http = require('http');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));


var creation_table_notification_query = "CREATE TABLE IF NOT EXISTS `notification_client` (`id` INTEGER PRIMARY KEY AUTOINCREMENT , `uuid` varchar(255) NOT NULL, `notification_id` varchar2(50) NOT NULL)";

var job = new CronJob('0 */15 * * * *', function(){
      console.log('Update database start');
      parser.updateDatabase(db);
  }, function () {
    
  },
  true // Start the job right now 
);

app.get('/classement', function(req, res){
    console.log('Classement Request');
    db.all('select * from classement order by points desc, diff desc', function (err, results) {
        res.send(results);
    });
});

app.get('/calendrier', function(req, res){
	console.log('Calendrier Request');
    db.all('select * from calendrier order by date asc', function (err, results) {
        res.send(results);
    });
});

app.get('/actus', function(req, res){
	console.log('Actus Request');
    db.all('select * from actus  order by date desc', function (err, results) {
        res.send(results);
    });
});

app.post('/parsePage', function(req, res) {
    console.log('url page : ' + req.body.url);
    var url = req.body.url;
    if(url.indexOf('en-images') != -1) {
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
	console.log('New registration ');
    var notificationId = req.body.notification_id;
    var uuid = req.body.uuid;
	console.log('New registration with notification id : ' + notificationId);
    if(notificationId && uuid) {
        db.serialize(function () {
            db.run(creation_table_notification_query);
            db.get("SELECT * FROM notification_client where uuid='" + uuid +"'", function(err, result){
                if(err) {
                    console.log('Error ' + err);
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

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

// Keep alive app
setInterval(function() {
    http.get("https://quiet-wave-7010.herokuapp.com/calendrier", function(res) {
        if (res.statusCode === 200) {
            console.log("Heroku Keep Alive Ping: Success");
        } else {
            console.log("Heroku Keep Alive Ping: Error - Status Code " + res.statusCode);
        }
    }).on('error', function(e) {
        console.log("Heroku Keep Alive Ping: Error - " + err.message);
    });
}, 30 * 60 * 1000); // load every 30 minutes