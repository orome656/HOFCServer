/*jslint node: true */

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

var optionsAgendaPathBase = 'http://www.fff.fr/la-vie-des-clubs/177005/agenda';
var optionsAgenda = {
    host: 'www.fff.fr',
    port: 80,
    path: '/la-vie-des-clubs/177005/agenda',
    activated: true
    
}

var optionsMatchInfosPathBase = '/match/fff/{id}/detail';
var optionsMatchInfos = {
    host: 'www.fff.fr',
    port: 80,
    path: '/match/fff/16806038/detail',
    activated: true
    
}

exports.downloadOptions = {
	classement:optionsClassement,
	calendrier:optionsCalendrier,
	actus:optionsActus,
    agenda:optionsAgenda,
    agendaBase:optionsAgendaPathBase,
    matchInfos:optionsMatchInfos,
    matchInfosBase:optionsMatchInfosPathBase
}