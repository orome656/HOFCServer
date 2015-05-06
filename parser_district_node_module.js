var http = require('http');
var cheerio = require("cheerio");
var notification = require('./send_notification.js')
var constants = require('./constants.js');
var HOFC_NAME = constants.constants.HOFC_NAME;

// Paramétrage url
var optionsClassement = {
    host: 'www.fff.fr',
    port: 80,
    path: '/championnats/fff/district-hautes-pyrenees/2014/305257-excellence/phase-1/poule-1/derniers-resultats',
    activated: true
};

var optionsCalendrier = {
    host: 'www.fff.fr',
    port: 80,
    path: '/la-vie-des-clubs/177005/calendrier/liste-matchs-a-venir/305257/phase-1/groupe-1',
    activated: true
};

var optionsAgendaPathBase = '/competitions/php/club/club_agenda.php?cl_no=177005&deb_semaine=';
var optionsAgenda = {
    host: 'district-foot-65.fff.fr',
    port: 80,
    path: '/competitions/php/club/club_agenda.php?cl_no=177005&deb_semaine=',
    activated: true
    
}

var optionsMatchInfosPathBase = '/competitions/php/competition/competition_match_detail_v2.php?o=1&t=1&ma_no=';
var optionsMatchInfos = {
    host: 'district-foot-65.fff.fr',
    port: 80,
    path: '/competitions/php/competition/competition_match_detail_v2.php?o=1&t=1&ma_no=',
    activated: true
    
}

/**
 * Query création des tables
 */
var creation_table_classement_query = constants.database.creation_table_classement_query;
var creation_table_calendrier_query = constants.database.creation_table_calendrier_query;
var creation_table_actus_query = constants.database.creation_table_actus_query;

/**
 *	Tableau permettant de convertir la chaine date récupérée en objet date
 */
var listeMois = constants.constants.listeMois;

/**
 *	Tableau permettant de convertir la chaine date récupérée en objet date pour les actus
 */
var listeMoisActu = constants.constants.listeMoisActu;

exports.updateDatabase = function(db) {
    var isDebug = (process.env.NODE_ENV == "DEV");
    if (optionsClassement.activated) {
        if(isDebug)
            console.log('Parser Classement Start');
        http.get(optionsClassement, function(res) {
            var result = "";
            if (res.statusCode != 200) {
                console.error('Classement get error. Result code ' + res.statusCode);
                return;
            }
            res.on('data', function (data) {
                result += data;
            });

            res.on('end', function () {
                if(isDebug)
                    console.log('End getting Classement Data at ' + new Date());
                
                $ = cheerio.load(result);
                db.connect(process.env.DATABASE_URL,function (err, client, done) {
                    client.query(creation_table_classement_query);
                    //FIXME todo
                });
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    }


    if (optionsCalendrier.activated) {
        if(isDebug)
            console.log('Parser Calendrier Start at ' + new Date());
        
        http.get(optionsCalendrier, function(res) {
          var result = "";
            if(res.statusCode != 200) {
                console.error('Calendrier get error. Result code ' + res.statusCode);
                return;
            }
            res.on('data', function(data) {
                result += data;
            });

            res.on('end', function() {
                if(isDebug)
                    console.log('End getting Calendrier Data at ' + new Date());
                
                $2 = cheerio.load(result);
                db.connect(process.env.DATABASE_URL, function(err, client, done) {
                    client.query(creation_table_calendrier_query);
                    // FIXME todo
                });
            });
        }).on('error', function(e) {
          console.log("Got error: " + e.message);
        });
    }
}
/**
* @param semaine Chaine de caractère au format DDMMYYYY
**/
exports.parseAgenda = function(semaine, callback) {
    if(semaine != null) {
        optionsAgenda.path = optionsAgendaPathBase + semaine;
    } else {
        optionsAgenda.path = optionsAgendaPathBase;
    }
    console.log(optionsAgenda.path);
    var request = http.get(optionsAgenda, function(res) {
        var result = "";
        var i = 0;
        if(res.statusCode != 200) {
            console.error('Agenda get error. Result code ' + res.statusCode);
            callback(res.statusCode);
            return;
        }
        res.on('data', function(data) {
            result += data;
        });
        res.on('end', function() {
            var returnedValue = [];
            $2 = cheerio.load(result);
            var linesCalendar = $2('#refpop').children('.w450').contents().filter(
                function(index, item) {
                    if($2(this).attr('class') == 'allonge'||$2(this).attr('class') == 'header'|| ($2(this).prop && $2(this).prop('tagName') == 'DIV'))
                    {
                        return false;
                    } else {
                        return true;
                    }
                });
            var nbLines = linesCalendar.length;
            if(nbLines == 0) {
                callback([]);
            }
            linesCalendar.each(function (index, item) {
                
                var title = $2(item).text();
                var node = $2(item).next().children();
                var date = node.children('.dat').text();
                var equipe1 = node.find('.team').first().text().trim().toUpperCase();
                var equipe2 = node.find('.team').last().text().trim().toUpperCase();
                var score = node.find('.score').children('strong').text();
                var score1 = null;
                var score2 = null;
                var html = node.children('.voirtout').html();
                console.log(html);
                if(html)
                    var infos = /det_match\(this,&apos;([0-9]+)/.exec(html)[1];
                if(date == null || date.length == 0) {
                    i++;
                    if(i == nbLines) callback(returnedValue);
                    return;
                }
                
                var dateString = date.split('-')[0].replace(/ +(?= )/g,'');
                var timeString = date.split('-')[1].trim();
                
                var jour = dateString.split(' ')[1];
                var mois = listeMoisActu[dateString.split(' ')[2]];
                var annee = dateString.split(' ')[3];
                
                var heure = timeString.split('H')[0];
                var minute = timeString.split('H')[1];
                
                if(equipe1 == null || equipe1.length == 0 || equipe2 == null || equipe2.length == 0) {
                    i++;
                    if(i == nbLines) callback(returnedValue);
                    return;
                }
                
                if(score) {
                    score1 = score.split('-')[0].trim();
                    score2 = score.split('-')[1].trim();
                }
                var array = {equipe1:equipe1, equipe2: equipe2, title: title, date: annee + '-' + mois + '-' + jour + ' '+heure+':'+minute+':00', score1: score1, score2: score2, infos:infos};
                returnedValue.push(array);
                i++;
                if(i == nbLines) callback(returnedValue);
            })
        })
    })
    
    request.on('error', function(e) {
        console.log(e);
        callback(-3);
    })
}

exports.parseMatchInfos = function(id, callback) {
    optionsMatchInfos.path = optionsMatchInfosPathBase + id;
    var request = http.get(optionsMatchInfos, function(res) {
        var result = "";
        var i = 0;
        if(res.statusCode != 200) {
            console.error('Agenda get error. Result code ' + res.statusCode);
            callback(res.statusCode);
            return;
        }
        res.on('data', function(data) {
            result += data;
        });
        
        res.on('end', function() {
            $2 = cheerio.load(result);
            var adresseContent = $2('.w350').children('div').first().find('.s90').contents();
            console.log(adresseContent[0].textContent);
            var nom = $2(adresseContent[0]).text();
            var adresse = $2(adresseContent[2]).text();
            var ville = $2(adresseContent[4]).text();
            
            var arbitreContent = $2('.w350').children('div').last().find('.s90').children();
            var arbitres = [];
            arbitreContent.each(function(index,line) {
                arbitres.push($2(line).text());
            })
            
            callback({nom:nom, adresse:adresse, ville:ville, arbitres:arbitres});
        });
    });
    
    request.on('error', function(e) {
        console.log(e);
        callback(-3);
    })
}
