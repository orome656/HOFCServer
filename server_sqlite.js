var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var CronJob = require('cron').CronJob
var parser = require('./parser_node_module.js');
var parserdistrict = require('./parser_district_node_module.js');
var http = require('http');
var pg = require('pg');
var notification = require('./send_notification.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));


var creation_table_notification_query = "CREATE TABLE IF NOT EXISTS notification_client (id serial PRIMARY KEY , uuid varchar(255) NOT NULL, notification_id varchar(255) NOT NULL)";

var job = new CronJob('0 */15 * * * *', function(){
      console.log('Update database start');
      parser.updateDatabase(pg);
  }, function () {
    
  },
  true // Start the job right now
);

app.get('/classement', function(req, res){
    console.log('Classement Request');
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        if(err) {
            console.error('Error while connecting to database', err);
        }
        client.query('select * from classement order by points desc, diff desc', function(err, results){
            done();
            if(err) {
                console.error('Error while getting classement : ' + err);
                return;
            }
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.send(results.rows);
        })
    })
});

app.get('/calendrier', function(req, res){
	console.log('Calendrier Request');
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        if(err) {
            console.error('Error while connecting to database', err);
        }
        client.query('select * from calendrier order by date asc', function(err, results){
            done();
            if(err) {
                console.error('Error while getting calendrier : ' + err);
                return;
            }
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.send(results.rows);
        })
    })
});

app.get('/actus', function(req, res){
	console.log('Actus Request');
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        if(err) {
            console.error('Error while connecting to database', err);
        }
        client.query('select * from actus  order by date desc', function(err, results){
            done();
            if(err) {
                console.error('Error while getting actus : ' + err);
                return;
            }
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.send(results.rows);
        })
    })
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
            
            res.set('Content-Type', 'application/json; charset=utf-8');
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
        pg.connect(process.env.DATABASE_URL, function (err, client, done) {
            client.query(creation_table_notification_query);
            client.query("SELECT * FROM notification_client where uuid='" + uuid +"'", function(err, result){
                if(err) {
                    console.log('Error ' + err);
                    return;
                }

                if(result.rows.length > 0) {
                    client.query("UPDATE notification_client set notification_id='"+notificationId+"' WHERE uuid='"+uuid+"'", function(){
                        done();
                    });
                } else {
                    client.query("INSERT INTO notification_client (notification_id, uuid) VALUES ('"+notificationId+"','"+uuid+"')", function() {
                        done();
                    });
                }
            });
        });
    } else {
        console.log('Missing one parameter. NotificationId='+ notificationId +', uuid=' + uuid);
    }
    res.send('0');
});


app.get('/agenda', function(req, res){
    parser.parseAgenda(null, function(result){
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(result);
    })
})

app.get('/agenda/:semaine', function(req, res){
    parser.parseAgenda(req.params.semaine, function(result){
        if(isNaN(result)) {
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.send(result);    
        } else if(result == 404) {
            res.send(-1);   
        } else {
            res.send(-2);
        }
        
    })
});

app.get('/agendadistrict/:semaine', function(req,res) {
    try {
        parserdistrict.parseAgenda(req.params.semaine, function(result){
            if(isNaN(result)) {
                res.set('Content-Type', 'application/json; charset=utf-8');
                res.send(result);
            } else if(result == 404) {
                res.send(-1);
            } else {
                res.send(-2);
            }

        })
    } catch(e) {
        console.log(e);
        res.send(-3);
    }
})

app.get('/dev/notification/:title/:message', function(req, res){
    var isDebug = (process.env.NODE_ENV == "DEV");
    if(isDebug) {
        notification.sendNotification(pg, req.params.title, req.params.message);
        res.send(0);
    } else {
        res.status(404)        // HTTP status 404: NotFound
           .send('Not found');
    }
    
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
    pg.connect(process.env.DATABASE_URL ,function (err, client, done) {
        if(err) {
            console.error('Error while connecting to database', err);
            return; 
        }
        client.query(creation_table_notification_query, function(err, result) {
            if(err) {
                console.log('Error while creating notifications table : ' + err);
            } else {
                console.log('Notification Table Created');   
            }
            done();
        });
    });
});

// Keep alive app
setInterval(function() {
    http.get("http://quiet-wave-7010.herokuapp.com/calendrier", function(res) {
        if (res.statusCode === 200) {
            console.log("Heroku Keep Alive Ping: Success");
        } else {
            console.log("Heroku Keep Alive Ping: Error - Status Code " + res.statusCode);
        }
    }).on('error', function(e) {
        console.log("Heroku Keep Alive Ping: Error - " + e.message);
    });
}, 30 * 60 * 1000); // load every 30 minutes