'use strict';
var cheerio = require("cheerio");
var constants = require('../constants/constants');
var Constants_District = require('../constants/constants_district');
var Utils = require('../utils/utils');
var optionsAgendaPathBase = Constants_District.agenda.basePath;
var optionsAgenda = Constants_District.agenda;
var optionsMatchInfosPathBase = Constants_District.matchInfos.basePath;
var optionsMatchInfos = Constants_District.matchInfos;
var optionsCalendrierExcellencePathBase = Constants_District.calendrierExcellence.basePath;
var optionsCalendrierExcellence = Constants_District.calendrierExcellence;
var listeMoisActu = constants.constants.listeMoisActu;
var ParserDistrictNodeModule = (function () {
    function ParserDistrictNodeModule() {
    }
    ParserDistrictNodeModule.parseAgenda = function (semaine, callback) {
        if (semaine !== null) {
            optionsAgenda.path = optionsAgendaPathBase + semaine;
        }
        else {
            optionsAgenda.path = optionsAgendaPathBase;
        }
        Utils.downloadData(optionsAgenda, function (result) {
            var returnedValue = [];
            var i = 0;
            var $2 = cheerio.load(result);
            var linesCalendar = $2('#refpop').children('.w450').contents().filter(function () {
                if ($2(this).attr('class') === 'allonge' || $2(this).attr('class') === 'header' || ($2(this).prop && $2(this).prop('tagName') === 'DIV')) {
                    return false;
                }
                else {
                    return true;
                }
            });
            var nbLines = linesCalendar.length;
            if (nbLines === 0) {
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
                var infos = null;
                if (html) {
                    infos = /det_match\(this,&apos;([0-9]+)/.exec(html)[1];
                }
                if (date === null || date.length === 0) {
                    i++;
                    if (i === nbLines) {
                        callback(returnedValue);
                    }
                    return;
                }
                var dateString = date.split('-')[0].replace(/ +(?= )/g, '');
                var timeString = date.split('-')[1].trim();
                var jour = dateString.split(' ')[1];
                var mois = listeMoisActu[dateString.split(' ')[2]];
                var annee = dateString.split(' ')[3];
                var heure = timeString.split('H')[0];
                var minute = timeString.split('H')[1];
                if (equipe1 === null || equipe1.length === 0 || equipe2 === null || equipe2.length === 0) {
                    i++;
                    if (i === nbLines) {
                        callback(returnedValue);
                    }
                    return;
                }
                if (score) {
                    score1 = score.split('-')[0].trim();
                    score2 = score.split('-')[1].trim();
                }
                var array = { equipe1: equipe1, equipe2: equipe2, title: title, date: annee + '-' + mois + '-' + jour + ' ' + heure + ':' + minute + ':00', score1: score1, score2: score2, infos: infos };
                returnedValue.push(array);
                i++;
                if (i === nbLines) {
                    callback(returnedValue);
                }
            });
        }, function (e) {
            console.log(e);
            callback(-3);
        });
    };
    ParserDistrictNodeModule.parseMatchInfos = function (id, callback) {
        optionsMatchInfos.path = optionsMatchInfosPathBase + id;
        Utils.downloadData(optionsMatchInfos, function (result) {
            var $2 = cheerio.load(result);
            var adresseContent = $2('.w350').children('div').first().find('.s90').contents();
            console.log(adresseContent[0].textContent);
            var nom = $2(adresseContent[0]).text();
            var adresse = $2(adresseContent[2]).text();
            var ville = $2(adresseContent[4]).text();
            var arbitreContent = $2('.w350').children('div').last().find('.s90').children();
            var arbitres = [];
            arbitreContent.each(function (index, line) {
                arbitres.push($2(line).text());
            });
            callback({ nom: nom, adresse: adresse, ville: ville, arbitres: arbitres });
        }, function (e) {
            console.log(e);
            callback(-3);
        });
    };
    ParserDistrictNodeModule.parseJourneeExcellence = function (journee, callback) {
        optionsCalendrierExcellence.path = optionsCalendrierExcellencePathBase + journee;
        Utils.downloadData(optionsCalendrierExcellence, function (result) {
            var returnedValue = [];
            var i = 0;
            var $2 = cheerio.load(result);
            var linesCalendar = $2('#refpop').children('.resultatmatch');
            var nbLines = linesCalendar.length;
            console.log('nbLines = ' + nbLines);
            if (nbLines === 0) {
                callback([]);
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
                console.log(date);
                console.log(equipe1);
                console.log(equipe2);
                console.log(score);
                var infos = null;
                if (html) {
                    infos = /det_match\(this,&apos;([0-9]+)/.exec(html)[1];
                }
                if (date === null || date.length === 0) {
                    i++;
                    if (i === nbLines) {
                        callback(returnedValue);
                    }
                    return;
                }
                var dateString = date.split('-')[0].replace(/ +(?= )/g, '');
                var timeString = date.split('-')[1].trim();
                var jour = dateString.split(' ')[1];
                var mois = listeMoisActu[dateString.split(' ')[2]];
                var annee = dateString.split(' ')[3];
                var heure = timeString.split('H')[0];
                var minute = timeString.split('H')[1];
                if (equipe1 === null || equipe1.length === 0 || equipe2 === null || equipe2.length === 0) {
                    i++;
                    if (i === nbLines) {
                        callback(returnedValue);
                    }
                    return;
                }
                if (score && score.split('-').length === 2) {
                    score1 = score.split('-')[0].trim();
                    score2 = score.split('-')[1].trim();
                }
                var array = { equipe1: equipe1, equipe2: equipe2, date: annee + '-' + mois + '-' + jour + ' ' + heure + ':' + minute + ':00', score1: score1, score2: score2, infos: infos };
                returnedValue.push(array);
                i++;
                if (i === nbLines) {
                    callback(returnedValue);
                }
            });
        }, function (e) {
            console.log(e);
            callback(-3);
        });
    };
    return ParserDistrictNodeModule;
})();
module.exports = ParserDistrictNodeModule;
