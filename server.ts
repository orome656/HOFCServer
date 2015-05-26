/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/express/express.d.ts" />
/// <reference path="typings/cron.d.ts" />
/// <reference path="typings/body-parser/body-parser.d.ts" />
/*jslint node: true */
'use strict';
import express = require('express');
import bodyParser = require('body-parser');
var app = express();
import cron = require('cron');
var CronJob = cron.CronJob;
import parser = require('./parsers/parser_node_module');
import parserdistrict = require('./parsers/parser_district_node_module');
import http = require('http');
import notificationReq = require('./notifications/send_notification');
var notification = notificationReq.Notification;
import databaseReq = require('./database/postgres');
var database = databaseReq.PostgresSQL;
import constants = require('./constants/constants');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));
app.use(express.static('web'));
app.use('/out',express.static('out'));
app.use(function(req, res, next) {
    console.log('Request on URL ' + req.url + ' with method ' + req.method);
    next();
});

// On lance la tache de mise a jour de la base 
// toute les 15min
new CronJob('0 */15 * * * *', function(){
      console.log('[Server] : Update database start');
      parser.updateDatabase();
    }, function () {
    
    },
    true // Start the job right now
);

/**
 * Permet de récupérer le classement de l'équipe
 */
app.get('/classement', function(req, res){
    database.getRankingInfos(function(/**array */results) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(results);
    }, function(err) {
        console.error('[Server] : Error while connecting to database', err);
        res.send(constants.errorCode.INTERNAL);
    });
});

/**
 * Permet de récupérer la liste des matchs de la saison avec les résultats des matchs
 */
app.get('/calendrier', function(req, res){
    database.getCalendarInfos(function(/**array */results) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(results);
    }, function(err) {
        console.error('[Server] : Error while connecting to database', err);
        res.send(constants.errorCode.INTERNAL);
    });
});

/**
 * Permet de récupérer la listes des actualités
 */
app.get('/actus', function(req, res){
    database.getActusInfos(function(/**array */results) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(results);
    }, function(err) {
        console.error('[Server] : Error while connecting to database', err);
        res.send(constants.errorCode.INTERNAL);
    });
});

/**
 * Permet de parser une page (récupération des textes ou des photos)
 */
app.post('/parsePage', function(req, res) {
    console.log('url page : ' + req.body.url);
    var url = req.body.url;
    if(url.indexOf('en-images') !== -1) {
        parser.parseDiaporama(url, function(resultats) {
            res.send(resultats);
        }, function(err) {
            console.error('[Server] : Error while parsing diaporama', err);
            res.send(constants.errorCode.INTERNAL);            
        });   
    } else {
        parser.parseArticle(url, function(resultats){
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.send(resultats);
        }, function(err) {
            console.error('[Server] : Error while parsing article', err);
            res.send(constants.errorCode.INTERNAL);            
        });   
    }
});

/**
 * Permet de s'enregistrer aux notifications push
 */
app.post('/registerPush', function(req, res){
    var notificationId = req.body.notification_id;
    var uuid = req.body.uuid;
	console.log('[Server] : New registration -> {notification_id: ' + notificationId + ', uuid:' + uuid + '}');
    if(notificationId && uuid) {
        database.insertNotificationId(notificationId, uuid, function() {
            res.send(0);
        }, function(err) {
            console.error('[Server] : Error while registring notification id', err);
            res.send(-3);            
        });
    } else {
        console.log('[Server] : Missing one parameter.');
        res.send(-3);
    }
});

/**
 * Permet de récupérer l'ensemble des matchs d'une semaine pour le club
 */
app.get('/agenda', function(req, res){
    parser.parseAgenda(null, function(result){
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(result);
    });
});

/**
 * Permet de récupérer l'ensemble des matchs d'une semaine pour le club
 */
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
        var day = date.getDate() + '';
        if(day.length === 1) {
            day = '0'+day;
        }
        var month = date.getMonth() + 1 + '';
        if(month.length === 1) {
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

/**
 * Permet de récupérer les informations sur un match (arbitres, lieu)
 */
app.get('/matchinfos/:id', function(req, res) {
    parser.parseMatchInfos(req.params.id, function(result) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(result);
    });
});


/**
 * Permet de récupérer les informations sur un match (arbitres, lieu)
 */
app.get('/matchinfosdistrict/:id', function(req, res) {
    parserdistrict.parseMatchInfos(req.params.id, function(result) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(result);
    });
});

app.get('/journee/:id', function (req, res) {
    parserdistrict.parseJourneeExcellence(req.params.id, function(result) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(result);
    });
});

/**
 * Permet de réucpérer certains paramètres de l'application
 */
app.get('/params', function(req, res) {
    res.send(constants.params);
});

app.get('/keepalive', function(req, res) {
    res.send('0');    
});

/**
 * Permet de tester les notifications sur environnement de développement
 */
app.get('/dev/notification/:title/:message', function(req, res){
    var isDebug = (process.env.NODE_ENV === "DEV");
    if(isDebug) {
        notification.sendNotification(req.params.title, req.params.message);
        res.send(0);
    } else {
        res.status(404).send('Not found'); // HTTP status 404: NotFound
    }
});

app.listen(app.get('port'), function() {
    console.log('[Server] : Node app is running at localhost:' + app.get('port'));
    database.init();
});

// Keep alive app
setInterval(function() {
    http.get(process.env.KEEP_ALIVE_URL, function(res) {
        if (res.statusCode === 200) {
            console.log("[Server] : Heroku Keep Alive Ping: Success");
        } else {
            console.log("[Server] : Heroku Keep Alive Ping: Error - Status Code " + res.statusCode);
        }
    }).on('error', function(e) {
        console.log('[Server] : Heroku Keep Alive Ping: Error - ' + e.message);
    });
}, 30 * 60 * 1000); // load every 30 minutes