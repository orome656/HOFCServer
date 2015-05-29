'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cron = require('cron');
var CronJob = cron.CronJob;
var parser = require('./parsers/parser_node_module');
var parserdistrict = require('./parsers/parser_district_node_module');
var http = require('http');
var notification = require('./notifications/send_notification');
var database = require('./database/postgres');
var constants = require('./constants/constants');
var Logger = require('./utils/logger');
var logger = new Logger('Server');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));
app.use(express.static('web'));
app.use(function (req, res, next) {
    console.log('Request on URL ' + req.url + ' with method ' + req.method);
    next();
});
new CronJob('0 */2 * * * *', function () {
    logger.info('Update database start');
    parser.updateDatabase();
}, function () {
}, true);
app.get('/classement', function (req, res) {
    database.getRankingInfos(function (results) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(results);
    }, function (err) {
        logger.error('Error while connecting to database', err);
        res.send(constants.errorCode.INTERNAL);
    });
});
app.get('/calendrier', function (req, res) {
    database.getCalendarInfos(function (results) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(results);
    }, function (err) {
        logger.error('Error while connecting to database', err);
        res.send(constants.errorCode.INTERNAL);
    });
});
app.get('/actus', function (req, res) {
    database.getActusInfos(function (results) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(results);
    }, function (err) {
        logger.error('Error while connecting to database', err);
        res.send(constants.errorCode.INTERNAL);
    });
});
app.post('/parsePage', function (req, res) {
    logger.debug('url page : ' + req.body.url);
    var url = req.body.url;
    if (url.indexOf('en-images') !== -1) {
        parser.parseDiaporama(url, function (resultats) {
            res.send(resultats);
        }, function (err) {
            logger.error('Error while parsing diaporama', err);
            res.send(constants.errorCode.INTERNAL);
        });
    }
    else {
        parser.parseArticle(url, function (resultats) {
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.send(resultats);
        }, function (err) {
            logger.error('Error while parsing article', err);
            res.send(constants.errorCode.INTERNAL);
        });
    }
});
app.post('/registerPush', function (req, res) {
    var notificationId = req.body.notification_id;
    var uuid = req.body.uuid;
    logger.info('New registration -> {notification_id: ' + notificationId + ', uuid:' + uuid + '}');
    if (notificationId && uuid) {
        database.insertNotificationId(notificationId, uuid, function () {
            res.send(0);
        }, function (err) {
            logger.error('Error while registring notification id', err);
            res.send(-3);
        });
    }
    else {
        logger.errorMessage('Missing one parameter.');
        res.send(-3);
    }
});
app.get('/agenda', function (req, res) {
    parser.parseAgenda(null, function (result) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(result);
    });
});
app.get('/agenda/:semaine', function (req, res) {
    parser.parseAgenda(req.params.semaine, function (result) {
        if (isNaN(result)) {
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.send(result);
        }
        else if (result === 404) {
            res.send(-1);
        }
        else {
            res.send(-2);
        }
    });
});
app.get('/agendadistrict/:semaine', function (req, res) {
    try {
        var date = new Date(req.params.semaine);
        var day = date.getDate() + '';
        if (day.length === 1) {
            day = '0' + day;
        }
        var month = date.getMonth() + 1 + '';
        if (month.length === 1) {
            month = '0' + month;
        }
        var year = date.getFullYear() + '';
        parserdistrict.parseAgenda(day + month + year, function (result) {
            if (isNaN(result)) {
                res.set('Content-Type', 'application/json; charset=utf-8');
                res.send(result);
            }
            else if (result === 404) {
                res.send(-1);
            }
            else {
                res.send(-2);
            }
        });
    }
    catch (e) {
        console.log(e);
        res.send(-3);
    }
});
app.get('/matchinfos/:id', function (req, res) {
    parser.parseMatchInfos(req.params.id, function (result) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(result);
    });
});
app.get('/matchinfosdistrict/:id', function (req, res) {
    parserdistrict.parseMatchInfos(req.params.id, function (result) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(result);
    });
});
app.get('/journee/:id', function (req, res) {
    parserdistrict.parseJourneeExcellence(req.params.id, function (result) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(result);
    });
});
app.get('/params', function (req, res) {
    res.send(constants.params);
});
app.get('/keepalive', function (req, res) {
    res.send('0');
});
app.get('/dev/notification/:title/:message', function (req, res) {
    var isDebug = (process.env.NODE_ENV === "DEV");
    if (isDebug) {
        notification.sendNotification(req.params.title, req.params.message);
        res.send(0);
    }
    else {
        res.status(404).send('Not found');
    }
});
app.listen(app.get('port'), function () {
    logger.info('Node app is running at localhost:' + app.get('port'));
    database.init();
});
setInterval(function () {
    http.get(process.env.KEEP_ALIVE_URL, function (res) {
        if (res.statusCode === 200) {
            logger.info("Heroku Keep Alive Ping: Success");
        }
        else {
            logger.errorMessage("Heroku Keep Alive Ping: Error - Status Code " + res.statusCode);
        }
    }).on('error', function (e) {
        logger.errorMessage('Heroku Keep Alive Ping: Error - ' + e.message);
    });
}, 30 * 60 * 1000);
