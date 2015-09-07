/**
 * Permet de récupérer les informations à partir du site fff.fr
 */
/// <reference path="../../typings/tsd.d.ts" />
/*jslint node: true */
'use strict';
var cheerio = require("cheerio");
import notification = require('../notifications/send_notification');
import constants = require('../constants/constants');
import Constants_FFF = require('../constants/constants_fff');
import database = require('../database/postgres');
import Utils = require('../utils/utils');
import Actu = require('../models/actu');
import Article = require('../models/article');
import ClassementLine = require('../models/classementLine');
import Match = require('../models/match');
import MatchAgenda = require('../models/matchAgenda');
import MatchInfos = require('../models/matchInfos');
var HOFC_NAME = constants.constants.HOFC_NAME;
import Logger = require('../utils/logger');
var logger = new Logger('Parser FFF');
// Paramétrage url
var optionsClassement = Constants_FFF.classement;

var optionsCalendrier = Constants_FFF.calendrier;
var optionsCalendrierArray = Constants_FFF.arrayCalendrier;

var optionsActus = Constants_FFF.actus;
var optionsAgendaPathBase = Constants_FFF.agenda.basePath;
var optionsAgenda = Constants_FFF.agenda;

var optionsMatchInfosPathBase = Constants_FFF.matchInfos.basePath;
var optionsMatchInfos = Constants_FFF.matchInfos;

/**
 *	Tableau permettant de convertir la chaine date récupérée en objet date
 */
var listeMois = constants.constants.listeMois;

/**
 *	Tableau permettant de convertir la chaine date récupérée en objet date pour les actus
 */
var listeMoisActu = constants.constants.listeMoisActu;

/**
 * Permet de télécharger les données d'un site
 */
var downloadData = Utils.downloadData;
class parser_node_module {
    public static updateDatabase(): void {
        if (optionsClassement.activated) {
            this.updateRankingData();
        }
    
        this.updateCalendarDataForTeam('equipe1');
        this.updateCalendarDataForTeam('equipe2');
        this.updateCalendarDataForTeam('equipe3');
        if (optionsActus.activated) {
            this.updateActusData();
        }
    }
    
    public static updateCalendarData(): void {
        Utils.downloadData(optionsCalendrier, function(result) {
            var $2 = cheerio.load(result);
            var linesCalendar = $2("div.list_calendar").children('div');
            
            $2(linesCalendar).each(function (index, line) {
                var match: Match = parser_node_module.parseCalendarLine(line);
                database.getMatchByName(match.equipe1, match.equipe2, function (result) {
                    if (result != null ) {
                        /**
                         * Mise a jour des informations
                         */
                        if((result.score1 === null) && 
                           (result.score2 === null) && 
                            match.score1 !== null && match.score2 !== null) {
                            var notifTitle = 'Nouveau Résultat';
                            var notifMessage = null;
                            if(match.equipe1 === HOFC_NAME && match.score1 > match.score2) {
                                notifMessage = 'Victoire du HOFC (' + match.score1+ '-' + match.score2 +') face à ' + match.equipe2;
                            } else if (match.equipe2 === HOFC_NAME && match.score2 > match.score1) {
                                notifMessage = 'Victoire du HOFC (' + match.score1+ '-' + match.score2 +') face à ' + match.equipe1;
                            } else if(match.equipe1 === HOFC_NAME && match.score1 < match.score2) {
                                notifMessage = 'Défaite du HOFC (' + match.score1+ '-' + match.score2 +') face à ' + match.equipe2;
                            } else if (match.equipe2 === HOFC_NAME && match.score2 < match.score1) {
                                notifMessage = 'Défaite du HOFC (' + match.score1+ '-' + match.score2 +') face à ' + match.equipe1;
                            } else {
                                notifMessage = 'Match nul entre le HOFC et ' + ((match.equipe1 === HOFC_NAME)? match.equipe2 : match.equipe1);
                            }
                            logger.info('Sending Notification with message : ' + notifMessage);
                            notification.sendNotification(notifTitle, notifMessage, {"TYPE": "Calendrier"});
                        }
                        database.updateCalendarLine(match);
                    } else {
                        /**
                         * Insertion d'une nouvelle ligne
                         */
                        database.insertCalendarLine(match);
                    }
    
                }, function(err) {
                    logger.error('Error while getting match on database', err);
                });
            });
        }, function(err) {
            logger.error('Error while downloading match infos', err);
        });
    }
    
    public static updateCalendarDataForTeam(equipe: string): void {
        Utils.downloadData(optionsCalendrierArray[equipe], function(result) {
            var $2 = cheerio.load(result);
            var linesCalendar = $2("div.list_calendar").children('div');
            
            $2(linesCalendar).each(function (index, line) {
                var match: Match = parser_node_module.parseCalendarLine(line);
                match.categorie = equipe;
                database.getMatchByName(match.equipe1, match.equipe2, function (result) {
                    if (result != null ) {
                        /**
                         * Mise a jour des informations
                         */
                        if((result.score1 === null) && 
                           (result.score2 === null) && 
                            match.score1 !== null && match.score2 !== null) {
                            var notifTitle = 'Nouveau Résultat '+ equipe;
                            var notifMessage = null;
                            if(match.equipe1.indexOf(HOFC_NAME) != -1 && match.score1 > match.score2) {
                                notifMessage = 'Victoire du HOFC (' + match.score1+ '-' + match.score2 +') face à ' + match.equipe2;
                            } else if (match.equipe2.indexOf(HOFC_NAME) != -1 && match.score2 > match.score1) {
                                notifMessage = 'Victoire du HOFC (' + match.score1+ '-' + match.score2 +') face à ' + match.equipe1;
                            } else if(match.equipe1.indexOf(HOFC_NAME) != -1 && match.score1 < match.score2) {
                                notifMessage = 'Défaite du HOFC (' + match.score1+ '-' + match.score2 +') face à ' + match.equipe2;
                            } else if (match.equipe2.indexOf(HOFC_NAME) != -1 && match.score2 < match.score1) {
                                notifMessage = 'Défaite du HOFC (' + match.score1+ '-' + match.score2 +') face à ' + match.equipe1;
                            } else {
                                notifMessage = 'Match nul entre le HOFC et ' + ((match.equipe1.indexOf(HOFC_NAME) != -1)? match.equipe2 : match.equipe1);
                            }
                            logger.info('Sending Notification with message : ' + notifMessage);
                            notification.sendNotification(notifTitle, notifMessage, {"TYPE": "Calendrier"});
                        }
                        database.updateCalendarLine(match);
                    } else {
                        /**
                         * Insertion d'une nouvelle ligne
                         */
                        database.insertCalendarLine(match);
                    }
    
                }, function(err) {
                    logger.error('Error while getting match on database', err);
                });
            });
        }, function(err) {
            logger.error('Error while downloading match infos', err);
        });
    }
    
    public static updateRankingData(): void {
        Utils.downloadData(optionsClassement, function(result) {
            var $ = cheerio.load(result);
            var linesClassement = $("table.classement").children('tbody').children().filter(function () {
                return ($(this).children() !== null && $(this).children().length > 3);
            });
            $(linesClassement).each(function (index, line) {
                var team = parser_node_module.parseClassementLine(line);
                if(team === null) {
                    return;
                }
                database.getRankByName(team.nom, function(result) {
                    if(result !== null) {
                        // Mise a jour des informatons de classement
                        database.updateRankingLine(team);
                    } else {
                        // Nouvelle équipe dans le classement
                        database.insertRankingLine(team);
                    }
                }, function(err) {
                    if(err) {
                        logger.error('Error while updating ranking data ', err);
                    }    
                });
            });
        }, function(err) {
            logger.error('Error while downloading match infos', err);
        });
    }
    
    public static updateActusData() : void {
        Utils.downloadData(optionsActus, function(result) {
            var $3 = cheerio.load(result);
            var linesActu = $3("#content").children('.post');
            
            $3(linesActu).each(function(index, line){
                var actus = parser_node_module.parseActuLine(line);
                database.getActuById(actus.postId, function (res) {
                    
                    if (res != null) {
                
                        database.updateActusLine(actus);
                    } else {
                        notification.sendNotification('Nouvel article sur HOFC.fr', actus.titre, {"URL": actus.url, "TYPE": "Actu"});
                        database.insertActusLine(actus);
                    }
                }, function(err) {
                    logger.error('Error while updating actus data ', err);
                });
            });
        }, function(err) {
            logger.error('Error while downloading actus infos', err);
        });
    }
    
    public static parseClassementLine(line /**: DOM Element */): ClassementLine {
        var $ = cheerio.load(line);
        var lineChildren = $(line).children();
        if (lineChildren !== null && lineChildren.length > 3) {
            
            var nom = $(lineChildren[1]).text().trim(),
                points = $(lineChildren[2]).text(),
                joue = $(lineChildren[3]).text(),
                victoire = $(lineChildren[4]).text(),
                nul = $(lineChildren[5]).text(),
                defaite = $(lineChildren[6]).text(),
                bp = $(lineChildren[8]).text(),
                bc = $(lineChildren[9]).text(),
                diff = $(lineChildren[11]).text();
                
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
        } else {
            return null;
        }
    }
    
    /**
     * Parse une ligne de calendrier
     * @param {string} ligne html des infos du match
     * @return {object} Informations sur le match
     */
    public static parseCalendarLine(line /**: DOM Element */): Match {
        var $2 = cheerio.load(line);
        var lineChildren = $2(line).children(),
            date = $2(lineChildren[0]).text().trim(),
            equipe1 = $2($2(lineChildren[1]).children()[0]).text().trim();
    
        equipe1 = equipe1.replace(/\r?\n|\r/g,' ');
        equipe1 = equipe1.replace(/ +/g,' ');
        var equipe1Complet = equipe1;
        if(equipe1.indexOf('Pénalité') !== -1) {
            equipe1 = equipe1.replace('Pénalité', '').trim();
        }
        var equipe2 = $2($2(lineChildren[1]).children()[2]).text().trim();
        equipe2 = equipe2.replace(/\r?\n|\r/g,' ');
        equipe2 = equipe2.replace(/ +/g,' ');
        var equipe2Complet = equipe2;
        if(equipe2.indexOf('Pénalité') !== -1) {
            equipe2 = equipe2.replace('Pénalité', '').trim();
        }
        var jourComplet = date.split('-')[0],
            heureComplet = date.split('-')[1],
            jour = jourComplet.split(' ')[1],
            mois = listeMois[jourComplet.split(' ')[2].toUpperCase()],
            annee = jourComplet.split(' ')[3],
            heure = "00",
            minute = "00";
    
        if(jour.length === 1) {
            jour = '0' + jour;    
        }
    
        if(heureComplet) {
            heure = heureComplet.split(':')[0];
            minute = heureComplet.split(':')[1];
        }
    
        var score = $2($2(lineChildren[1]).children()[1]).text().trim(),
            score1 = null,
            score2 = null;
    
        if (score.indexOf('-') !== -1) {
            score1 = parseInt(score.split('-')[0]);
            score2 = parseInt(score.split('-')[1]);
            if(isNaN(score1)) {
                score1 = null;
            }
            if(isNaN(score2)) {
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
    }
    
    /**
     * Permet de parser un article d'actu
     * @param {string} ligne html de l'élément
     * @return {object} Informations de l'actualité
     */
    public static parseActuLine(line /**: DOM Element */): Actu {
        var $ = cheerio.load(line);
        var postId = $(line).attr('id').split('-')[1]; 
        /**
         * Title : {
         *      href: url de l'actu
         *      text: titre de l'actu
         * }
         */
        var title = $(line).children('.title').children().children(),
            date = $(line).children('.postmeta').children('span').text(),
            urlImage = $(line).children('.entry').children('a').children().attr('src'),
            texte = $(line).children('.entry').children('p').text(),
            jour = date.split(' ')[0];
    
        if (jour.length === 1) {
            jour = '0' + jour;
        }
    
        var mois = listeMoisActu[date.split(' ')[1]],
            annee = date.split(' ')[2];
        var actu = new Actu();
        actu.date = annee + '-' + mois + '-' + jour + ' 00:00:00';
        actu.postId = postId;
        actu.image = urlImage;
        actu.texte = texte;
        actu.url = title.attr('href');
        actu.titre = title.text();
        return actu;
    }
    
    /**
     * Parse la liste des images d'un diaporama
     * @param {string} url URL a du diaporama
     * @param {function} callback appelé lorsde la fin du traitement
     * @param {function} fail Callback d'erreur
     */
    public static parseDiaporama(url: string, callback: (results: Array<string>)=>void, fail: Function) { // TODO Ajouter le type de retour
        downloadData(url, function(result) { 
            // do parse
            var $4 = cheerio.load(result);
            var resultats = [];
            $4('.ngg-gallery-thumbnail-box a').each(function(index, line) {
                resultats.push($4(line).attr('href'));
            });
            callback(resultats);
        }, function(err) {
            if(fail)
                fail(err);
        });
    }
    
    /**
     * Récupère le contenu d'un article du HOFC
     * @param url URL de l'article a parser sur le site http://www.HOFC.fr/
     * @param {function} fail Callback d'erreur
     */
    public static parseArticle(url: string, callback: ((article: Article) => void), fail: Function) {
        Utils.downloadData(url, function(result) { 
            // do parse
            var $5 = cheerio.load(result);
            var title = $5('.post .title').text().trim();
            var dateString = $5('.post .postmeta').text().trim();
            var contents = $5('.post .entry').children();
            var article="";
            for(var i=0; i< contents.length;i++) {
                if($5(contents[i]).attr('class') === 'sociable') {
                    break;
                }
                
                article += $5(contents[i]).text().trim();
                article += "\n";
            }
            
            var jour = dateString.split(' ')[0];
    
            if (jour.length === 1) {
                jour = '0' + jour;
            }
    
            var mois = listeMoisActu[dateString.split(' ')[1]],
                annee = dateString.split(' ')[2];
            
            var resultats = new Article();
            resultats.title = title;
            resultats.date = annee + '-' + mois + '-' + jour + ' ' + '00:00:00';
            resultats.article = article;
            callback(resultats);
        }, function(err) {
            if(fail)
                fail(err);
        });
    }
    
    /**
     * Parse l'agenda d'une semaine
    * @param semaine Chaine de caractère au format YYYY-MM-DD
    * @param callback Callback a appeler à la fin de la récupération
    **/
    public static parseAgenda(semaine, callback: ((res:Array<MatchAgenda>) => void), fail: Function) {
        if(semaine !== null) {
            optionsAgenda.path = optionsAgendaPathBase + '/semaine-' + semaine;
        } else {
            optionsAgenda.path = optionsAgendaPathBase;
        }
        Utils.downloadData(optionsAgenda, function(result) {
            var i = 0;
            var returnedValue = new Array<MatchAgenda>();
            var $2 = cheerio.load(result);
            
            var linesCalendar = $2("div.list_calendar").children('h3'),
                nbLines = linesCalendar.length;
            if(nbLines === 0) {
                callback([]);
            }
            $2(linesCalendar).each(function (index, line) {
                var title = $2(line).text().trim();
                var match = $2(line).next();
                var lineChildren = $2(match).children(),
                            date = $2(lineChildren[0]).text().trim(),
                            equipe1 = $2($2(lineChildren[1]).children()[0]).text().trim();
    
                var equipe2 = $2($2(lineChildren[1]).children()[2]).text().trim();
                var jourComplet = date.split('-')[0],
                    heureComplet = date.split('-')[1],
                    jour = jourComplet.split(' ')[1].trim(),
                    mois = listeMois[jourComplet.split(' ')[2].toUpperCase()],
                    annee = jourComplet.split(' ')[3],
                    heure = "00",
                    minute = "00";
    
                if(jour.length === 1) {
                    jour = '0' + jour;
                }
                if(heureComplet) {
                    heure = heureComplet.split(':')[0].trim();
                    minute = heureComplet.split(':')[1];
                }
    
                var score = $2($2(lineChildren[1]).children()[1]).text().trim(),
                    score1 = null,
                    score2 = null;
    
                if (score.indexOf('-') !== -1) {
                    score1 = parseInt(score.split('-')[0]);
                    score2 = parseInt(score.split('-')[1]);
                    if(isNaN(score1)) {
                        score1 = null;
                    }
                    if(isNaN(score2)) {
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
                matchAgenda.date = annee + '-' + mois + '-' + jour + ' '+heure+':'+minute+':00';
                
                returnedValue.push(matchAgenda);
                i++;
                if(i === nbLines) {
                    callback(returnedValue);
                }
            });
        }, function(err) {
            logger.error('Error while downloading agenda data ', err);
            fail(err);
        });
    }
    
    /**
     * Récupére les informations sur un match
     * @param {string} id Identifiant du match
     * @param {function} callback fonction appelée lors de la fin du traitement
     * 
     */
    public static parseMatchInfos(id: string, callback: ((match: MatchInfos)=>void)) {
        optionsMatchInfos.path = optionsMatchInfosPathBase.replace('{id}', id);
        Utils.downloadData(optionsMatchInfos, function(result) {
            var $2 = cheerio.load(result);
            var childs = $2('.info_inner').children('p');
            var adresseNodes = childs.first().contents();
            var nom = adresseNodes.eq(0).text().trim() + adresseNodes.eq(1).text().trim();
            var adresse = adresseNodes.eq(3).text().trim();
            var ville = adresseNodes.eq(5).text().trim();
            
            var arbitresNode = $2('.info_inner').children('p').last().children().slice(1);
            
            var arbitres = new Array<string>();
            
            arbitresNode.each(function(index,line) {
                arbitres.push($2(line).text());
            });
            
            var matchInfos = new MatchInfos();
            matchInfos.adresse = adresse;
            matchInfos.nom = nom;
            matchInfos.ville = ville;
            matchInfos.arbitres = arbitres;
            
            callback(matchInfos);
        }, function(err) {
            logger.error('Error while downloading match infos data ', err);
        });
    }
};

export = parser_node_module;
