/// <reference path="../typings/tsd.d.ts" />
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
import notification = require('./notifications/send_notification');
import database = require('./database/postgres');
import constants = require('./constants/constants');
import Logger = require('./utils/logger');
import Utils = require('./utils/utils');
import Actu = require('./models/actu');

var logger = new Logger('Server');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));
app.use(express.static('web'));
app.use(function(req, res, next) {
    logger.info('Request on URL ' + req.url + ' with method ' + req.method);
    next();
});

// On lance la tache de mise a jour de la base 
// toute les 15min
new CronJob('0 */15 0,9-23 * * *', function(){
      logger.info('Update database start');
      parser.updateDatabase();
    }, null, true // Start the job right now
);

new CronJob('0 */30 0,9-23 * * *', function() {
    logger.info('Start updating database journee');
    var nbJournee = constants.params.SEASON_MATCHS_COUNT;
    for(var i = 1; i<=22; i++)
        parserdistrict.updateDatabaseJournee(i);
}, null, true);

/**
 * Permet de récupérer le classement de l'équipe
 */
app.get('/classement', function(req, res){
    database.getRankingInfos(function(results) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(Utils.arrayToString(results));
    }, function(err) {
        logger.error('Error while connecting to database', err);
        res.send(constants.errorCode.INTERNAL);
    });
});

/**
 * Permet de récupérer la liste des matchs de la saison avec les résultats des matchs
 */
app.get('/calendrier', function(req, res){
    database.getCalendarInfos(function(results) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(Utils.arrayToString(results));
    }, function(err) {
        logger.error('Error while connecting to database', err);
        res.send(constants.errorCode.INTERNAL);
    });
});

/**
 * Permet de récupérer la listes des actualités
 */
app.get('/actus', function(req, res){
    database.getActusInfos(function(results: Array<Actu>) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(Utils.arrayToString(results));
    }, function(err) {
        logger.error('Error while connecting to database', err);
        res.send(constants.errorCode.INTERNAL);
    });
});

/**
 * Permet de parser une page (récupération des textes ou des photos)
 */
app.post('/parsePage', function(req, res) {
    logger.debug('url page : ' + req.body.url);
    var url = req.body.url;
    if(url.indexOf('en-images') !== -1) {
        parser.parseDiaporama(url, function(resultats) {
            res.send(resultats);
        }, function(err) {
            logger.error('Error while parsing diaporama', err);
            res.send(constants.errorCode.INTERNAL);            
        });   
    } else {
        parser.parseArticle(url, function(resultats){
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.send(resultats);
        }, function(err) {
            logger.error('Error while parsing article', err);
            res.send(constants.errorCode.INTERNAL);            
        });   
    }
});

/**
 * Permet de s'enregistrer aux notifications push
 */
app.post('/registerPush', function(req, res){
    var notificationId: string = req.body.notification_id;
    var uuid: string = req.body.uuid;
	logger.info('New registration -> {notification_id: ' + notificationId + ', uuid:' + uuid + '}');
    if(notificationId && uuid) {
        database.insertNotificationId(notificationId, uuid, function() {
            res.send(0);
        }, function(err) {
            logger.error('Error while registring notification id', err);
            res.send(constants.errorCode.INTERNAL);            
        });
    } else {
        logger.errorMessage('Missing one parameter.');
        res.send(constants.errorCode.CALLING_PROBLEM);
    }
});

/**
 * Permet de récupérer l'ensemble des matchs d'une semaine pour le club
 */
app.get('/agenda', function(req, res){
    parser.parseAgenda(null, function(result){
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(Utils.arrayToString(result));
    }, function(err) {
        res.status(503).send('Error while contacting backend');
    });
});

/**
 * Permet de récupérer l'ensemble des matchs d'une semaine pour le club
 */
app.get('/agenda/:semaine', function(req, res){
    parser.parseAgenda(req.params.semaine, function(result){
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(Utils.arrayToString(result));
    }, function(err) {
        res.status(503).send('Error while contacting backend');
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
        parserdistrict.parseAgenda(day+month+year, function(result, error){
            if(result != null && error == 0) {
                res.set('Content-Type', 'application/json; charset=utf-8');
                res.send(result);
            } else if(error === 404) {
                res.send(constants.errorCode.BACKEND);
            } else {
                res.send(constants.errorCode.UNKNOWN);
            }
        });
    } catch(e) {
        logger.error('Error while getting agenda infos', e);
        res.send(constants.errorCode.INTERNAL);
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
    database.getJournee(req.params.id, function(result) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(result);
    }, null);
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
app.get('/dev/notification/:title/:message/:type', function(req, res){
    var isDebug = (process.env.NODE_ENV === "DEV");
    if(isDebug) {
        notification.sendNotification(req.params.title, req.params.message, {'TYPE': req.params.type});
        res.status(200).send(constants.errorCode.OK + '');
    } else {
        res.status(404).send('Not found'); // HTTP status 404: NotFound
    }
});

app.listen(app.get('port'), function() {
    logger.info('Node app is running at localhost:' + app.get('port'));
    database.init();
});