/**
 * Permet de récupérer les informations à partir du site district-foot-65.fff.fr
 */
/// <reference path="../../typings/tsd.d.ts" />
/*jslint node: true */
'use strict';
var cheerio = require("cheerio");
//var notification = require('../notifications/send_notification.js');
import constants = require('../constants/constants');
import Constants_District = require('../constants/constants_district');
import Utils = require('../utils/utils');
import MatchAgenda = require('../models/matchAgenda');
import Journee = require('../models/journee');
import Logger = require('../utils/logger');
var logger = new Logger('Parser_District');
var optionsAgendaPathBase = Constants_District.agenda.basePath;
var optionsAgenda = Constants_District.agenda;
import database = require('../database/postgres');
var optionsMatchInfosPathBase = Constants_District.matchInfos.basePath;
var optionsMatchInfos = Constants_District.matchInfos;
import Match = require('../models/match');
import ClassementLine = require('../models/classementLine');
import notification = require('../notifications/send_notification');
var optionsActus = Constants_District.actus;
import ParserCommun = require('./parser_commun_node_module');

var optionsCalendrierExcellencePathBase = Constants_District.calendrierExcellence.basePath;
var optionsCalendrierExcellence = Constants_District.calendrierExcellence;
var optionsCalendrierByJournee = Constants_District.calendrierByJournee;
var optionsCalendrierArray = Constants_District.arrayCalendrier;
var optionsClassementArray = Constants_District.arrayClassement;
/**
 *	Tableau permettant de convertir la chaine date récupérée en objet date pour les actus
 */
var listeMoisActu = constants.constants.listeMoisActu;
var listeMoisDistrict = constants.constants.listeMoisDistrict;
var HOFC_NAME = constants.constants.HOFC_NAME;
/**
* @param semaine Chaine de caractère au format DDMMYYYY
**/
class ParserDistrictNodeModule {
    
    /**
     * Met à jour les informations dans la base de données (Calendrier, Classement, Actus) pour les différentes équipes
     */
    public static updateDatabase(): void {
        this.updateRankingDataForTeam('equipe1');
        this.updateRankingDataForTeam('equipe2');
        this.updateRankingDataForTeam('equipe3');
    
        this.updateCalendarDataForTeam('equipe1');
        this.updateCalendarDataForTeam('equipe2');
        this.updateCalendarDataForTeam('equipe3');
    }
    
    /**
     * Mise a jour du calendrier
     */
    public static updateCalendarDataForTeam(equipe: string): void {
        Utils.downloadData(optionsCalendrierArray[equipe], function(result) {
            var $2 = cheerio.load(result);
            var linesCalendar = $2('#refpop').children('div');
            $2(linesCalendar).each(function (index, line) {
                var match: Match = ParserDistrictNodeModule.parseCalendarLine(line);
                match.categorie = equipe;
                ParserCommun.handleCalendrierLine(match, equipe);
            });
        }, function(err) {
            logger.error('Error while downloading match infos', err);
        });
    }
    
    /**
     * Parse une ligne de calendrier
     * 
     * @param {string} ligne html des infos du match
     * @return {object} Informations sur le match
     */
    public static parseCalendarLine(line /**: DOM Element */): Match {
        var $2 = cheerio.load(line);
        
        var node = $2(line);
        var date = node.children('.dat').text();
        var equipe1 = node.find('.team').first().text().trim().toUpperCase();
        var equipe2 = node.find('.team').last().text().trim().toUpperCase();
        var score = node.find('.score').children('strong').text();
        var score1 = null;
        var score2 = null;
        var html = node.children('.voirtout').html();
        
        var equipe1Complet = equipe1;
        if(equipe1.indexOf('Pénalité') !== -1) {
            equipe1 = equipe1.replace('Pénalité', '').trim();
        }
        
        var equipe2Complet = equipe2;
        if(equipe2.indexOf('Pénalité') !== -1) {
            equipe2 = equipe2.replace('Pénalité', '').trim();
        }
        
        var infos = null;
        if(html) {
            infos = /det_match\(this,&apos;([0-9]+)/.exec(html)[1];
        }
        
        var dateString = date.split('-')[0].replace(/ +(?= )/g,'');
        
        var jour = dateString.split(' ')[1];
        var mois = listeMoisDistrict[dateString.split(' ')[2]];
        var annee = dateString.split(' ')[3];
        
        var heure = '00';
        var minute = '00';
        
        if(date.split('-')[1] != null) {
            var timeString = date.split('-')[1].trim();
            heure = timeString.split('H')[0];
            minute = timeString.split('H')[1];
        }
        
        // Le champ peut contenir 'Non joué'
        if(score != null && score.indexOf('-') != -1) {
            score1 = score.split('-')[0].trim();
            score2 = score.split('-')[1].trim();
        }
        var match = new Match();
        match.equipe1 = equipe1;
        match.equipe2 = equipe2;
        match.equipe1Complet = equipe1Complet;
        match.equipe2Complet = equipe2Complet;
        match.date = annee + '-' + mois + '-' + jour + ' '+heure+':'+minute+':00';
        match.score1 = score1;
        match.score2 = score2;
        match.infos = infos;
        
        return match;
    }
    
     /**
     * Met à jour la table classement pour l'équipe passé en paramétre
     */   
    public static updateRankingDataForTeam(equipe: string): void {
        Utils.downloadData(optionsClassementArray[equipe], function(result) {
            var $2 = cheerio.load(result);
            var linesClassement = $2('.tablo').children('tr');
            $2(linesClassement).each(function (index, line) {
                var team = ParserDistrictNodeModule.parseClassementLine(line);
                if(team === null) {
                    return;
                }
                team.categorie = equipe;
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
    
    /**
     * Transforme le bout de page passé en paramètre en objet classement
     * 
     * @param ligne html a parser.
     * @return objet classement
     */
    public static parseClassementLine(line /**: DOM Element */): ClassementLine {
        var $ = cheerio.load(line);
        var lineChildren = $(line).children();
        if (lineChildren !== null && lineChildren.length > 3) {
            
            var nom = $(lineChildren[1]).text().trim().toUpperCase(),
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
     * Récupère l'agenda d'une semaine
     */
    public static parseAgenda(semaine, callback: (array: Array<MatchAgenda>, error: number) => void) {
        if(semaine !== null) {
            optionsAgenda.path = optionsAgendaPathBase + semaine;
        } else {
            optionsAgenda.path = optionsAgendaPathBase;
        }
        
        Utils.downloadData(optionsAgenda, function(result) {
            var returnedValue = new Array<MatchAgenda>();
            var i = 0;
            var $2 = cheerio.load(result);
            var linesCalendar = $2('#refpop').children('.w450').contents().filter(
                function() {
                    if($2(this).attr('class') === 'allonge'||$2(this).attr('class') === 'header'|| ($2(this).prop && $2(this).prop('tagName') === 'DIV'))
                    {
                        return false;
                    } else {
                        return true;
                    }
                });
            var nbLines: number = linesCalendar.length;
            if(nbLines === 0) {
                callback(returnedValue, 0);
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
                
                var infos = null;
                if(html) {
                    infos = /det_match\(this,&apos;([0-9]+)/.exec(html)[1];
                }
                if(date === null || date.length === 0) {
                    i++;
                    if(i === nbLines) {
                        callback(returnedValue,0);
                    }
                    return;
                }
                
                var dateString = date.split('-')[0].replace(/ +(?= )/g,'');
                
                var jour = dateString.split(' ')[1];
                var mois = listeMoisDistrict[dateString.split(' ')[2]];
                var annee = dateString.split(' ')[3];
                
                var heure = '00';
                var minute = '00';
                
                if(date.split('-')[1] != null) {
                    var timeString = date.split('-')[1].trim();
                    heure = timeString.split('H')[0];
                    minute = timeString.split('H')[1];
                }
                
                if(equipe1 === null || equipe1.length === 0 || equipe2 === null || equipe2.length === 0) {
                    i++;
                    if(i === nbLines) {
                        callback(returnedValue,0);
                    }
                    return;
                }
                
                // Le champ peut contenir 'Non joué'
                if(score != null && score.indexOf('-') != -1) {
                    score1 = score.split('-')[0].trim();
                    score2 = score.split('-')[1].trim();
                }
                var match = new MatchAgenda();
                match.equipe1 = equipe1;
                match.equipe2 = equipe2;
                match.title = title;
                match.date = annee + '-' + mois + '-' + jour + ' '+heure+':'+minute+':00';
                match.score1 = score1;
                match.score2 = score2;
                match.infos = infos;
                
                returnedValue.push(match);
                i++;
                if(i === nbLines) {
                    callback(returnedValue,0);
                }
            });
        }, function(e) {
            logger.error('Error while downloading agenda infos data ', e);
            callback(null, -3);
        });
    }
    /**
     * Récupére les infos du match correspondant a l'id passé en parametre
     */
    public static parseMatchInfos(id, callback) {
        optionsMatchInfos.path = optionsMatchInfosPathBase + id;
        Utils.downloadData(optionsMatchInfos, function(result) {
            var $2 = cheerio.load(result);
            var adresseContent = $2('.w350').children('div').first().find('.s90').contents();
            
            var nom = $2(adresseContent[0]).text();
            var adresse = $2(adresseContent[2]).text();
            var ville = $2(adresseContent[4]).text();
            
            var arbitreContent = $2('.w350').children('div').last().find('.s90').children();
            var arbitres = [];
            arbitreContent.each(function(index,line) {
                arbitres.push($2(line).text());
            });
            
            callback({nom:nom, adresse:adresse, ville:ville, arbitres:arbitres});
        }, function(e) {
            logger.error('Error while downloading match infos data ', e);
            callback(-3);        
        });
    }
    
    /**
     * Récupére les matchs d'une journee du championnat de l'équipe passé en parametre 
     */
    public static parseJourneeExcellence(categorie: string, journee, callback: (array: Array<Journee>, error: number) => void) {
        optionsCalendrierByJournee[categorie].path = optionsCalendrierByJournee[categorie].basePath + journee;
        Utils.downloadData(optionsCalendrierByJournee[categorie], function(result) {
            var returnedValue = [];
            var i = 0;
            var $2 = cheerio.load(result);
            var linesCalendar = $2('#refpop').children('.resultatmatch');
            var nbLines = linesCalendar.length;
            
            if(nbLines === 0) {
                callback([], 0);
            }
            linesCalendar.each(function (index, item) {
                
                var node = $2(item);
                var date = node.children('.dat').text();
                var equipe1 = node.find('.team').first().text().trim().toUpperCase();
                var equipe2 = node.find('.team').last().text().trim().toUpperCase();
                var score = node.find('.score').children('strong').text();
                var score1 = null;
                var score2 = null;
                var html = node.children('.voirtout').html();
                
                var infos = null;
                if(html) {
                    infos = /det_match\(this,&apos;([0-9]+)/.exec(html)[1];
                }
                if(date === null || date.length === 0) {
                    i++;
                    if(i === nbLines) {
                        callback(returnedValue, 0);
                    }
                    return;
                }
                
                var dateString = date.split('-')[0].replace(/ +(?= )/g,'');
                var jour = dateString.split(' ')[1];
                var mois = listeMoisDistrict[dateString.split(' ')[2]];
                var annee = dateString.split(' ')[3];
                
                var heure = '00';
                var minute = '00';
                
                if(date.split('-')[1] != null) {
                    var timeString = date.split('-')[1].trim();
                    heure = timeString.split('H')[0];
                    minute = timeString.split('H')[1];
                }
                
                if(equipe1 === null || equipe1.length === 0 || equipe2 === null || equipe2.length === 0) {
                    i++;
                    if(i === nbLines) {
                        callback(returnedValue, 0);
                    }
                    return;
                }
                
                if(score && score.split('-').length === 2) {
                    score1 = score.split('-')[0].trim();
                    score2 = score.split('-')[1].trim();
                }
                var array = {equipe1:equipe1, equipe2: equipe2, date: annee + '-' + mois + '-' + jour + ' '+heure+':'+minute+':00', score1: score1, score2: score2, infos:infos};
                returnedValue.push(array);
                i++;
                if(i === nbLines) {
                    callback(returnedValue, 0);
                }
            });
        }, function(e) {
            logger.error('Error while downloading journee excellence infos data ', e);
            callback(null, -3);        
        });
    }
    
    /**
     * Met à jour les informations d'une journee d'un championnat
     */
    public static updateDatabaseJournee(idJournee: number, categorie: string) {
        this.parseJourneeExcellence(categorie, idJournee, function(res, err) {
            if(err == 0) {
                database.deleteJournee(categorie, idJournee);
                res.forEach(function(element) {
                    element.idJournee = idJournee;
                    element.categorie = categorie;
                    database.insertJournee(element, null, null);
                });
            }
        });
    }
}

export = ParserDistrictNodeModule;