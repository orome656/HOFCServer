/// <reference path="typings/express.d.ts" />
/*jslint node: true */
'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var CronJob = require('cron').CronJob;
var parser = require('./parsers/parser_node_module.js');
var parserdistrict = require('./parsers/parser_district_node_module.js');
var http = require('http');
var notification = require('./notifications/send_notification.js');
var database = require('./database/postgres.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));
app.use(express.static('web'));
app.use(function(req, res, next) {
    console.log('Request on URL ' + req.url + ' with method ' + req.method);
    next();
});

// On lance la tache de mise a jour de la base 
// toute les 15min
new CronJob('0 */15 * * * *', function(){
      console.log('Update database start');
      //parser.updateDatabase();
  }, function () {
    
  },
  true // Start the job right now
);

app.get('/classement', function(req, res){
    database.getRankingInfos(function(/**array */results) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(results);
    }, function(err) {
        console.error('Error while connecting to database', err);
    });
});

app.get('/calendrier', function(req, res){
    database.getCalendarInfos(function(/**array */results) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(results);
    }, function(err) {
        console.error('Error while connecting to database', err);
    });
});

app.get('/actus', function(req, res){
    database.getActusInfos(function(/**array */results) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(results);
    }, function(err) {
        console.error('Error while connecting to database', err);
    });
});

app.post('/parsePage', function(req, res) {
    console.log('url page : ' + req.body.url);
    var url = req.body.url;
    if(url.indexOf('en-images') !== -1) {
        parser.parseDiaporama(url, function(resultats) {
            res.send(resultats);
        });   
    } else {
        parser.parseArticle(url, function(resultats){
            
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.send(resultats);
        });   
    }
});

app.post('/registerPush', function(req, res){
    var notificationId = req.body.notification_id;
    var uuid = req.body.uuid;
	console.log('New registration with notification id : ' + notificationId);
    if(notificationId && uuid) {
        database.insertNotificationId(notificationId, uuid);
    } else {
        console.log('Missing one parameter. NotificationId='+ notificationId +', uuid=' + uuid);
    }
    res.send('0');
});


app.get('/agenda', function(req, res){
    parser.parseAgenda(null, function(result){
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(result);
    });
});

app.get('/agenda/:semaine', function(req, res){
    parser.parseAgenda(req.params.semaine, function(result){
        if(isNaN(result)) {
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.send(result);
        } else if(result === 404) {
            res.send(-1);
        } else {
            res.send(-2);
        } 
    });
});

/**
* @param semaine Chaine de caractère au format YYYY-MM-DD
**/
app.get('/agendadistrict/:semaine', function(req,res) {
    try {
        var date = new Date(req.params.semaine);
        var day = date.getDate();
        if(day < 9) {
            day = '0'+day;
        }
        var month = date.getMonth() + 1;
        if(month < 9) {
            month = '0'+month;
        }
        var year = date.getFullYear() + '';
        parserdistrict.parseAgenda(day+month+year, function(result){
            if(isNaN(result)) {
                res.set('Content-Type', 'application/json; charset=utf-8');
                res.send(result);
            } else if(result === 404) {
                res.send(-1);
            } else {
                res.send(-2);
            }
        });
    } catch(e) {
        console.log(e);
        res.send(-3);
    }
});
app.get('/matchinfos/:id', function(req, res) {
    parser.parseMatchInfos(req.params.id, function(result) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(result);
    });
});

app.get('/matchinfosdistrict/:id', function(req, res) {
    parserdistrict.parseMatchInfos(req.params.id, function(result) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(result);
    });
});

app.get('/dev/notification/:title/:message', function(req, res){
    var isDebug = (process.env.NODE_ENV === "DEV");
    if(isDebug) {
        notification.sendNotification(req.params.title, req.params.message);
        res.send(0);
    } else {
        res.status(404)        // HTTP status 404: NotFound
           .send('Not found');
    }
    
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
    database.init();
});

// Keep alive app
setInterval(function() {
    http.get(process.env.KEEP_ALIVE_URL, function(res) {
        if (res.statusCode === 200) {
            console.log("Heroku Keep Alive Ping: Success");
        } else {
            console.log("Heroku Keep Alive Ping: Error - Status Code " + res.statusCode);
        }
    }).on('error', function(e) {
        console.log("Heroku Keep Alive Ping: Error - " + e.message);
    });
}, 30 * 60 * 1000); // load every 30 minutes