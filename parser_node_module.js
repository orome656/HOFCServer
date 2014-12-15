var http = require('http');
var cheerio = require("cheerio");
var notification = require('./send_notification.js')
  
var HOFC_NAME = 'HORGUES ODOS F.C.';

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

var optionsActus = {
    host: 'www.hofc.fr',
    port: 80,
    path: '/category/seniors/',
    activated: true
};

/**
 * Query création des tables
 */
var creation_table_classement_query = "CREATE TABLE IF NOT EXISTS `classement` (`id` INTEGER PRIMARY KEY AUTOINCREMENT , `nom` varchar(255) NOT NULL, `points` int(11) NOT NULL, `joue` int(11) NOT NULL, `gagne` int(11) NOT NULL, `nul` int(11) NOT NULL, `perdu` int(11) NOT NULL, `bp` int(11) NOT NULL, `bc` int(11) NOT NULL, `diff` int(11) NOT NULL)";
var creation_table_calendrier_query = "CREATE TABLE IF NOT EXISTS `calendrier` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `equipe1` varchar(255) NOT NULL, `score1` int(11) NOT NULL, `equipe2` varchar(255) NOT NULL, `score2` int(11) NOT NULL, `date` date DEFAULT NULL)";
var creation_table_actus_query = "CREATE TABLE IF NOT EXISTS `actus` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `postId` int(11) DEFAULT NULL, `titre` varchar(255) DEFAULT NULL, `texte` text, `url` varchar(255) DEFAULT NULL, `image` varchar(255) DEFAULT NULL, `date` date DEFAULT NULL)";

/**
 *	Tableau permettant de convertir la chaine date récupérée en objet date
 */
var listeMois = {
        "JANVIER": "01",
        "FÉVRIER": "02",
        "MARS": "03",
        "AVRIL": "04",
        "MAI": "05",
        "JUIN": "06",
        "JUILLET": "07",
        "AOUT": "08",
        "SEPTEMBRE": "09",
        "OCTOBRE": "10",
        "NOVEMBRE": "11",
        "DÉCEMBRE": "12"
    };

/**
 *	Tableau permettant de convertir la chaine date récupérée en objet date pour les actus
 */
var listeMoisActu = {
        "janvier": "01",
        "février": "02",
        "mars": "03",
        "avril": "04",
        "mai": "05",
        "juin": "06",
        "juillet": "07",
        "août": "08",
        "septembre": "09",
        "octobre": "10",
        "novembre": "11",
        "décembre": "12"
    };

/**
 *
 */
var doAfterQuery = function (errors, resultats) {
    "use strict";
	if (errors) {
		console.log('Erreur de mise a jour ' + errors);
		return;
	}
	console.log('Mise a jour OK');
}
console.log('Parser start at ' + new Date());

exports.updateDatabase = function(db) {
    if (optionsClassement.activated) {
        console.log('Parser Classement Start');
        http.get(optionsClassement, function(res) {
            var result = "";
            if (res.statusCode != 200) {
                return;
            }
            res.on('data', function (data) {
                result += data;
            });

            res.on('end', function () {
                console.log('End getting Classement Data at ' + new Date());
                $ = cheerio.load(result);
                db.serialize(function () {
                    db.run(creation_table_classement_query);
                    var linesClassement = $("table.classement").children('tbody').children().filter(function (index) {
                        return ($(this).children() !== null && $(this).children().length > 3);
                    });
                    var nbLines = linesClassement.length;
                    $(linesClassement).each(function (index, line) {
                        var lineChildren = $(line).children();
                        if (lineChildren != null && lineChildren.length > 3) {
                            var place = $(lineChildren[0]).text().trim(),
                                nom = $(lineChildren[1]).text().trim(),
                                points = $(lineChildren[2]).text(),
                                joue = $(lineChildren[3]).text(),
                                victoire = $(lineChildren[4]).text(),
                                nul = $(lineChildren[5]).text(),
                                defaite = $(lineChildren[6]).text(),
                                bp = $(lineChildren[8]).text(),
                                bc = $(lineChildren[9]).text(),
                                diff = $(lineChildren[11]).text();
                            db.get('select * from classement where nom LIKE "' + nom + '"',  function (err, results) {
                                if (err) {
                                    console.log('Erreur ' + err);
                                    return;
                                }
                                console.log('Updating Classement for team ' + nom);
                                if (results != null) {
                                    if(results.joue < joue) {
                                        notification.sendNotification(db, 'Nouveau Classement', 'Le HOFC est maintenant ' + place + ((place == 1) ? 'er' : 'eme'));
                                    }
                                    db.run('UPDATE classement set points=' + points + ', joue=' + joue + ', gagne=' + victoire + ', nul=' + nul + ', perdu=' + defaite + ', bp=' + bp + ', bc=' + bc + ', diff=' + diff + ' WHERE nom LIKE "' + nom + '"', doAfterQuery);
                                } else {
                                    db.run('insert into classement (nom,points,joue,gagne,nul,perdu,bp,bc,diff) VALUES ("' + nom + '",' + points + ',' + joue + ' , ' + victoire + ',' + nul + ',' + defaite + ', ' + bp + ',' + bc + ',' + diff + ')', doAfterQuery);
                                }
                            });
                        }
                    });
                });
            });
        }).on('error', function(e) {
            "use strict";
            console.log("Got error: " + e.message);
        });
    }


    if (optionsCalendrier.activated) {
        console.log('Parser Calendrier Start');
        http.get(optionsCalendrier, function(res) {
          var result = "";
            if(res.statusCode != 200) {
                console.log('Calendrier get error. Result code ' + res.statusCode);
                return;
            }
            res.on('data', function(data) {
                result += data;
            });

            res.on('end', function() {
                console.log('End getting Calendrier Data at ' + new Date());
                $2 = cheerio.load(result);
                db.serialize(function() {
                    db.run(creation_table_calendrier_query);
                    var linesCalendar = $2("div.list_calendar").children('div'),
                        nbLines = linesCalendar.length;
                    console.log(nbLines);
                    $2(linesCalendar).each(function (index, line) {
                        var lineChildren = $2(line).children(),
                            date = $2(lineChildren[0]).text().trim(),
                            equipe1 = $2($2(lineChildren[1]).children()[0]).text().trim();

                        equipe1 = equipe1.replace(/\r?\n|\r/g,' ');
                        equipe1 = equipe1.replace(/ +/g,' ');
                        console.log('equipe1 ' + equipe1);

                        var equipe2 = $2($2(lineChildren[1]).children()[2]).text().trim();
                        equipe2 = equipe2.replace(/\r?\n|\r/g,' ');
                        equipe2 = equipe2.replace(/ +/g,' ');
                        console.log('equipe2 ' + equipe2);

                        var jourComplet = date.split('-')[0],
                            heureComplet = date.split('-')[1],
                            jour = jourComplet.split(' ')[1],
                            mois = listeMois[jourComplet.split(' ')[2].toUpperCase()],
                            annee = jourComplet.split(' ')[3],
                            heure = "00",
                            minute = "00";

                        if(jour.length == 1) jour = '0' + jour;

                        if(heureComplet) {
                            heure = heureComplet.split(':')[0];
                            minute = heureComplet.split(':')[1];
                        }

                        var score = $2($2(lineChildren[1]).children()[1]).text().trim(),
                            score1 = null,
                            score2 = null;

                        if (score.indexOf('-') != -1) {
                            score1 = score.split('-')[0];
                            score2 = score.split('-')[1];
                        }

                        db.get('select * from calendrier where equipe1 LIKE "' + equipe1 + '" AND equipe2 LIKE "' + equipe2 + '"', function (err, results) {
                            if (err) {
                                console.log('Erreur ' + err);
                                return;
                            }
                            console.log('Updating Calendrier for match ' + equipe1 + ' - ' + equipe2);
                            if (results != null) {
                                if((results.score1 == null || results.score1 == "null") && (results.score2 == null || results.score2 == "null") && score1 != null && score2 != null) {
                                    var notifTitle = 'Nouveau Résultat';
                                    var notifMessage = null;
                                    if(equipe1 == HOFC_NAME && score1 > score2) {
                                        notifMessage = 'Victoire du HOFC (' + score1+ '-' + score2 +') face à ' + equipe2;
                                    } else if (equipe2 == HOFC_NAME && score2 > score1) {
                                        notifMessage = 'Victoire du HOFC (' + score1+ '-' + score2 +') face à ' + equipe1;
                                    } else if(equipe1 == HOFC_NAME && score1 < score2) {
                                        notifMessage = 'Défaite du HOFC (' + score1+ '-' + score2 +') face à ' + equipe2;
                                    } else if (equipe2 == HOFC_NAME && score2 < score1) {
                                        notifMessage = 'Défaite du HOFC (' + score1+ '-' + score2 +') face à ' + equipe1;
                                    } else {
                                        notifMessage = 'Match nul entre le HOFC et ' + ((equipe1 == HOFC_NAME)? equipe2 : equipe1);
                                    }
                                    console.log('Notification message : ' + notifMessage);
                                    notification.sendNotification(db, notifTitle, notifMessage);
                                }
                                db.run('UPDATE calendrier set date="' + annee + '-' + mois + '-' + jour + ' ' + heure + ':'
                                        + minute + ':00' + '", score1=' + score1 + ', score2=' + score2 + ' WHERE equipe1 LIKE "' + equipe1 + '" AND equipe2 LIKE "' + equipe2 + '"', doAfterQuery);
                            } else {
                                db.run('insert into calendrier (date,equipe1,equipe2,score1,score2) VALUES ("' + annee + '-' + mois + '-' + jour + ' ' + heure + ':'
                                        + minute + ':00' + '","' + equipe1 + '","' + equipe2 + '","' + score1 + '","' + score2 + '")', doAfterQuery);
                            }

                        });
                    });
                });
            });
        }).on('error', function(e) {
          console.log("Got error: " + e.message);
        });
    }

    if (optionsActus.activated) {
        console.log('Parser actus start at ' + new Date());
        http.get(optionsActus, function(res) {
            var result = "";
            if(res.statusCode != 200) {
                return;
            }
            res.on('data', function(data) {
                result += data;
            });

            res.on('end', function() {
                console.log('End getting response actus at ' + new Date());
                $3 = cheerio.load(result);
                db.serialize(function() {
                    db.run(creation_table_actus_query);
                    console.log('Recup actu start');
                    var linesActu = $3("#content").children('.post');
                    var nbLines = linesActu.length;
                    console.log('Actus to get ' + nbLines);
                    $3(linesActu).each(function(index, line){
                        console.log('working on line :' + line);
                        var postId = $3(line).attr('id').split('-')[1]; 
                        /**
                         * Title : {
                         *      href: url de l'actu
                         *      text: titre de l'actu
                         * }
                         */
                        var title = $3(line).children('.title').children().children(),
                            date = $3(line).children('.postmeta').children('span').text(),
                            urlImage = $3(line).children('.entry').children('a').children().attr('src'),
                            texte = $3(line).children('.entry').children('p').text(),
                            jour = date.split(' ')[0];

                        if (jour.length === 1) {
                            jour = '0' + jour;
                        }

                        var mois = listeMoisActu[date.split(' ')[1]],
                            annee = date.split(' ')[2];

                        db.get('select * from actus where postId=' + postId, function (err, results) {
                            if (err) {
                                console.log('Erreur ' + err);
                                return;
                            }
                            if (results != null) {
                                var query = 'update actus set titre=?, texte=?, url=?, image=?, date=? WHERE postId=?',
                                    parameters = [title.text(), texte, title.attr('href'), urlImage, annee + '-' + mois + '-' + jour + ' 00:00:00', postId];

                                console.log('Updating actus postId = ' + postId + ' with parameters : ' + parameters);

                                db.run(query, parameters, doAfterQuery);
                            } else {
                                notification.sendNotification(db, 'Nouvel article sur HOFC.fr', title.text());
                                var query = 'insert into actus (postId, titre, texte, url, image, date) VALUES (?,?,?,?,?,?)',
                                    parameters = [postId, title.text(), texte, title.attr('href'), urlImage, annee + '-' + mois + '-' + jour + ' 00:00:00'];

                                console.log('Inserting actus postId = ' + postId + ' with parameters : ' + parameters);

                                db.run(query, parameters, doAfterQuery);
                            }
                        });
                    });
                });
            });
        }).on('error', function(e) {
          console.log("Got error: " + e.message);
        });
    }
}

exports.parseDiaporama = function(url, callback) {
    http.get(url, function(res) {
        
            var result = "";
            if(res.statusCode != 200) {
                return;
            }
            res.on('data', function(data) {
                result += data;
            });

            res.on('end', function() { 
                // do parse
                $4 = cheerio.load(result);
                var photos = $4('.ngg-gallery-thumbnail-box a');
                var resultats = [];
                $4('.ngg-gallery-thumbnail-box a').each(function(index, line) {
                    resultats.push($4(line).attr('href'));
                });
                callback(resultats);
            })
    });
}

exports.parseArticle = function(url, callback) {
    http.get(url, function(res) {
        
            var result = "";
            if(res.statusCode != 200) {
                return;
            }
            res.on('data', function(data) {
                result += data;
            });

            res.on('end', function() { 
                // do parse
                $5 = cheerio.load(result);
                var title = $5('.post .title').text().trim();
                var dateString = $5('.post .postmeta').text().trim();
                var contents = $5('.post .entry').children();
                var article="";
                for(var i=0; i< contents.length;i++) {
                    if($5(contents[i]).attr('class') == 'sociable')
                        break;
                    
                    article += $5(contents[i]).text().trim();
                    article += "\n";
                }
                
                var jour = dateString.split(' ')[0];

                if (jour.length === 1) {
                    jour = '0' + jour;
                }

                var mois = listeMoisActu[dateString.split(' ')[1]],
                    annee = dateString.split(' ')[2];
                
                var resultats = {};
                resultats.title = title;
                resultats.date = annee + '-' + mois + '-' + jour + ' ' + '00:00:00';
                resultats.article = article;
                callback(resultats);
            })
    });
}


