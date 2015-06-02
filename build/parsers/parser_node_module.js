'use strict';
var cheerio = require("cheerio");
var notification = require('../notifications/send_notification');
var constants = require('../constants/constants');
var Constants_FFF = require('../constants/constants_fff');
var database = require('../database/postgres');
var Utils = require('../utils/utils');
var Actu = require('../models/actu');
var Article = require('../models/article');
var ClassementLine = require('../models/classementLine');
var Match = require('../models/match');
var MatchAgenda = require('../models/matchAgenda');
var HOFC_NAME = constants.constants.HOFC_NAME;
var Logger = require('../utils/logger');
var logger = new Logger('Parser FFF');
var optionsClassement = Constants_FFF.classement;
var optionsCalendrier = Constants_FFF.calendrier;
var optionsActus = Constants_FFF.actus;
var optionsAgendaPathBase = Constants_FFF.agenda.basePath;
var optionsAgenda = Constants_FFF.agenda;
var optionsMatchInfosPathBase = Constants_FFF.matchInfos.basePath;
var optionsMatchInfos = Constants_FFF.matchInfos;
var listeMois = constants.constants.listeMois;
var listeMoisActu = constants.constants.listeMoisActu;
var downloadData = Utils.downloadData;
var parser_node_module = (function () {
    function parser_node_module() {
    }
    parser_node_module.updateDatabase = function () {
        if (optionsClassement.activated) {
            this.updateRankingData();
        }
        if (optionsCalendrier.activated) {
            this.updateCalendarData();
        }
        if (optionsActus.activated) {
            this.updateActusData();
        }
    };
    parser_node_module.updateCalendarData = function () {
        Utils.downloadData(optionsCalendrier, function (result) {
            var $2 = cheerio.load(result);
            var linesCalendar = $2("div.list_calendar").children('div');
            $2(linesCalendar).each(function (index, line) {
                var match = parser_node_module.parseCalendarLine(line);
                database.getMatchByName(match.equipe1, match.equipe2, function (results) {
                    if (results.length > 0) {
                        if ((results[0].score1 === null) && (results[0].score2 === null) && match.score1 !== null && match.score2 !== null) {
                            var notifTitle = 'Nouveau Résultat';
                            var notifMessage = null;
                            if (match.equipe1 === HOFC_NAME && match.score1 > match.score2) {
                                notifMessage = 'Victoire du HOFC (' + match.score1 + '-' + match.score2 + ') face à ' + match.equipe2;
                            }
                            else if (match.equipe2 === HOFC_NAME && match.score2 > match.score1) {
                                notifMessage = 'Victoire du HOFC (' + match.score1 + '-' + match.score2 + ') face à ' + match.equipe1;
                            }
                            else if (match.equipe1 === HOFC_NAME && match.score1 < match.score2) {
                                notifMessage = 'Défaite du HOFC (' + match.score1 + '-' + match.score2 + ') face à ' + match.equipe2;
                            }
                            else if (match.equipe2 === HOFC_NAME && match.score2 < match.score1) {
                                notifMessage = 'Défaite du HOFC (' + match.score1 + '-' + match.score2 + ') face à ' + match.equipe1;
                            }
                            else {
                                notifMessage = 'Match nul entre le HOFC et ' + ((match.equipe1 === HOFC_NAME) ? match.equipe2 : match.equipe1);
                            }
                            logger.info('Sending Notification with message : ' + notifMessage);
                            notification.sendNotification(notifTitle, notifMessage);
                        }
                        database.updateCalendarLine(match);
                    }
                    else {
                        database.insertCalendarLine(match);
                    }
                }, function (err) {
                    console.log(err);
                });
            });
        }, function (err) {
            console.log(err);
        });
    };
    parser_node_module.updateRankingData = function () {
        Utils.downloadData(optionsClassement, function (result) {
            var $ = cheerio.load(result);
            var linesClassement = $("table.classement").children('tbody').children().filter(function () {
                return ($(this).children() !== null && $(this).children().length > 3);
            });
            $(linesClassement).each(function (index, line) {
                var team = parser_node_module.parseClassementLine(line);
                if (team === null) {
                    return;
                }
                database.getRankByName(team.nom, function (results) {
                    if (results !== null && results.length > 0) {
                        database.updateRankingLine(team);
                    }
                    else {
                        database.insertRankingLine(team);
                    }
                }, function (err) {
                    if (err) {
                        logger.error('Error while updating ranking data ', err);
                    }
                });
            });
        }, function (err) {
            console.log(err);
        });
    };
    parser_node_module.updateActusData = function () {
        Utils.downloadData(optionsActus, function (result) {
            var $3 = cheerio.load(result);
            var linesActu = $3("#content").children('.post');
            $3(linesActu).each(function (index, line) {
                var actus = parser_node_module.parseActuLine(line);
                database.getActuById(actus.postId, function (res) {
                    if (res.length > 0) {
                        database.updateActusLine(actus);
                    }
                    else {
                        notification.sendNotification('Nouvel article sur HOFC.fr', actus.titre);
                        database.insertActusLine(actus);
                    }
                }, function (err) {
                    console.log(err);
                });
            });
        }, function (err) {
            console.log(err);
        });
    };
    parser_node_module.parseClassementLine = function (line) {
        var $ = cheerio.load(line);
        var lineChildren = $(line).children();
        if (lineChildren !== null && lineChildren.length > 3) {
            var nom = $(lineChildren[1]).text().trim(), points = $(lineChildren[2]).text(), joue = $(lineChildren[3]).text(), victoire = $(lineChildren[4]).text(), nul = $(lineChildren[5]).text(), defaite = $(lineChildren[6]).text(), bp = $(lineChildren[8]).text(), bc = $(lineChildren[9]).text(), diff = $(lineChildren[11]).text();
            var classementLine = new ClassementLine();
            classementLine.nom = nom;
            classementLine.points = points;
            classementLine.joue = joue;
            classementLine.gagne = victoire;
            classementLine.nul = nul;
            classementLine.perdu = defaite;
            classementLine.bp = bp;
            classementLine.bc = bc;
            classementLine.diff = diff;
            return classementLine;
        }
        else {
            return null;
        }
    };
    parser_node_module.parseCalendarLine = function (line) {
        var $2 = cheerio.load(line);
        var lineChildren = $2(line).children(), date = $2(lineChildren[0]).text().trim(), equipe1 = $2($2(lineChildren[1]).children()[0]).text().trim();
        equipe1 = equipe1.replace(/\r?\n|\r/g, ' ');
        equipe1 = equipe1.replace(/ +/g, ' ');
        var equipe1Complet = equipe1;
        if (equipe1.indexOf('Pénalité') !== -1) {
            equipe1 = equipe1.replace('Pénalité', '').trim();
        }
        var equipe2 = $2($2(lineChildren[1]).children()[2]).text().trim();
        equipe2 = equipe2.replace(/\r?\n|\r/g, ' ');
        equipe2 = equipe2.replace(/ +/g, ' ');
        var equipe2Complet = equipe2;
        if (equipe2.indexOf('Pénalité') !== -1) {
            equipe2 = equipe2.replace('Pénalité', '').trim();
        }
        var jourComplet = date.split('-')[0], heureComplet = date.split('-')[1], jour = jourComplet.split(' ')[1], mois = listeMois[jourComplet.split(' ')[2].toUpperCase()], annee = jourComplet.split(' ')[3], heure = "00", minute = "00";
        if (jour.length === 1) {
            jour = '0' + jour;
        }
        if (heureComplet) {
            heure = heureComplet.split(':')[0];
            minute = heureComplet.split(':')[1];
        }
        var score = $2($2(lineChildren[1]).children()[1]).text().trim(), score1 = null, score2 = null;
        if (score.indexOf('-') !== -1) {
            score1 = parseInt(score.split('-')[0]);
            score2 = parseInt(score.split('-')[1]);
            if (isNaN(score1)) {
                score1 = null;
            }
            if (isNaN(score2)) {
                score2 = null;
            }
        }
        var formattedDate = annee + "-" + mois + "-" + jour + " " + heure + ":" + minute + ":00";
        var match = new Match();
        match.equipe1 = equipe1;
        match.equipe2 = equipe2;
        match.equipe1Complet = equipe1Complet;
        match.equipe2Complet = equipe2Complet;
        match.date = formattedDate;
        match.score1 = score1;
        match.score2 = score2;
        return match;
    };
    parser_node_module.parseActuLine = function (line) {
        var $ = cheerio.load(line);
        var postId = $(line).attr('id').split('-')[1];
        var title = $(line).children('.title').children().children(), date = $(line).children('.postmeta').children('span').text(), urlImage = $(line).children('.entry').children('a').children().attr('src'), texte = $(line).children('.entry').children('p').text(), jour = date.split(' ')[0];
        if (jour.length === 1) {
            jour = '0' + jour;
        }
        var mois = listeMoisActu[date.split(' ')[1]], annee = date.split(' ')[2];
        var actu = new Actu();
        actu.date = annee + '-' + mois + '-' + jour + ' 00:00:00';
        actu.postId = postId;
        actu.image = urlImage;
        actu.texte = texte;
        actu.url = title.attr('href');
        actu.titre = title.text();
        return actu;
    };
    parser_node_module.parseDiaporama = function (url, callback, fail) {
        downloadData(url, function (result) {
            var $4 = cheerio.load(result);
            var resultats = [];
            $4('.ngg-gallery-thumbnail-box a').each(function (index, line) {
                resultats.push($4(line).attr('href'));
            });
            callback(resultats);
        }, function (err) {
            if (fail)
                fail(err);
        });
    };
    parser_node_module.parseArticle = function (url, callback, fail) {
        Utils.downloadData(url, function (result) {
            var $5 = cheerio.load(result);
            var title = $5('.post .title').text().trim();
            var dateString = $5('.post .postmeta').text().trim();
            var contents = $5('.post .entry').children();
            var article = "";
            for (var i = 0; i < contents.length; i++) {
                if ($5(contents[i]).attr('class') === 'sociable') {
                    break;
                }
                article += $5(contents[i]).text().trim();
                article += "\n";
            }
            var jour = dateString.split(' ')[0];
            if (jour.length === 1) {
                jour = '0' + jour;
            }
            var mois = listeMoisActu[dateString.split(' ')[1]], annee = dateString.split(' ')[2];
            var resultats = new Article();
            resultats.title = title;
            resultats.date = annee + '-' + mois + '-' + jour + ' ' + '00:00:00';
            resultats.article = article;
            callback(resultats);
        }, function (err) {
            if (fail)
                fail(err);
        });
    };
    parser_node_module.parseAgenda = function (semaine, callback, fail) {
        if (semaine !== null) {
            optionsAgenda.path = optionsAgendaPathBase + '/semaine-' + semaine;
        }
        else {
            optionsAgenda.path = optionsAgendaPathBase;
        }
        Utils.downloadData(optionsAgenda, function (result) {
            var i = 0;
            var returnedValue = new Array();
            var $2 = cheerio.load(result);
            var linesCalendar = $2("div.list_calendar").children('h3'), nbLines = linesCalendar.length;
            if (nbLines === 0) {
                callback([]);
            }
            $2(linesCalendar).each(function (index, line) {
                var title = $2(line).text().trim();
                var match = $2(line).next();
                var lineChildren = $2(match).children(), date = $2(lineChildren[0]).text().trim(), equipe1 = $2($2(lineChildren[1]).children()[0]).text().trim();
                var equipe2 = $2($2(lineChildren[1]).children()[2]).text().trim();
                var jourComplet = date.split('-')[0], heureComplet = date.split('-')[1], jour = jourComplet.split(' ')[1].trim(), mois = listeMois[jourComplet.split(' ')[2].toUpperCase()], annee = jourComplet.split(' ')[3], heure = "00", minute = "00";
                if (jour.length === 1) {
                    jour = '0' + jour;
                }
                if (heureComplet) {
                    heure = heureComplet.split(':')[0].trim();
                    minute = heureComplet.split(':')[1];
                }
                var score = $2($2(lineChildren[1]).children()[1]).text().trim(), score1 = null, score2 = null;
                if (score.indexOf('-') !== -1) {
                    score1 = parseInt(score.split('-')[0]);
                    score2 = parseInt(score.split('-')[1]);
                    if (isNaN(score1)) {
                        score1 = null;
                    }
                    if (isNaN(score2)) {
                        score2 = null;
                    }
                }
                var infosId = lineChildren.last().children('a').attr('data-target');
                var matchAgenda = new MatchAgenda();
                matchAgenda.equipe1 = equipe1;
                matchAgenda.equipe2 = equipe2;
                matchAgenda.score1 = score1;
                matchAgenda.score2 = score2;
                matchAgenda.infos = infosId;
                matchAgenda.title = title;
                matchAgenda.date = annee + '-' + mois + '-' + jour + ' ' + heure + ':' + minute + ':00';
                returnedValue.push(matchAgenda);
                i++;
                if (i === nbLines) {
                    callback(returnedValue);
                }
            });
        }, function (err) {
            console.log(err);
            fail(err);
        });
    };
    parser_node_module.parseMatchInfos = function (id, callback) {
        optionsMatchInfos.path = optionsMatchInfosPathBase.replace('{id}', id);
        Utils.downloadData(optionsMatchInfos, function (result) {
            var $2 = cheerio.load(result);
            var childs = $2('.info_inner').children('p');
            var adresseNodes = childs.first().contents();
            var nom = adresseNodes.eq(0).text().trim() + adresseNodes.eq(1).text().trim();
            var adresse = adresseNodes.eq(3).text().trim();
            var ville = adresseNodes.eq(5).text().trim();
            var arbitresNode = $2('.info_inner').children('p').last().children().slice(1);
            var arbitres = [];
            arbitresNode.each(function (index, line) {
                arbitres.push($2(line).text());
            });
            callback({ nom: nom, adresse: adresse, ville: ville, arbitres: arbitres });
        }, function (err) {
            console.log(err);
        });
    };
    return parser_node_module;
})();
;
module.exports = parser_node_module;
