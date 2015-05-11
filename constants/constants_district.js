/**
 * Contient les constantes spécifiques au site district-foot-65.fff.fr
 */
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

var optionsAgendaPathBase = '/competitions/php/club/club_agenda.php?cl_no=177005&deb_semaine=';
var optionsAgenda = {
    host: 'district-foot-65.fff.fr',
    port: 80,
    path: '/competitions/php/club/club_agenda.php?cl_no=177005&deb_semaine=',
    activated: true
    
};

var optionsMatchInfosPathBase = '/competitions/php/competition/competition_match_detail_v2.php?o=1&t=1&ma_no=';
var optionsMatchInfos = {
    host: 'district-foot-65.fff.fr',
    port: 80,
    path: '/competitions/php/competition/competition_match_detail_v2.php?o=1&t=1&ma_no=',
    activated: true
    
};

exports.downloadOptions = {
	classement:optionsClassement,
	calendrier:optionsCalendrier,
	actus:optionsActus,
    agenda:optionsAgenda,
    agendaBase:optionsAgendaPathBase,
    matchInfos:optionsMatchInfos,
    matchInfosBase:optionsMatchInfosPathBase
}