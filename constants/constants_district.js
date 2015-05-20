/**
 * Contient les constantes spécifiques au site district-foot-65.fff.fr
 */
/*jslint node: true */
var utils = require('../utils/utils.js');

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
var optionsAgenda = Object.create(null);
utils.define(optionsAgenda, 'host', 'district-foot-65.fff.fr');
utils.define(optionsAgenda, 'port', 80);
utils.define(optionsAgenda, 'path', '/competitions/php/club/club_agenda.php?cl_no=177005&deb_semaine=');
utils.define(optionsAgenda, 'activated', true);


var optionsMatchInfosPathBase = '/competitions/php/competition/competition_match_detail_v2.php?o=1&t=1&ma_no=';
var optionsMatchInfos = Object.create(null);
utils.define(optionsMatchInfos, 'host', 'district-foot-65.fff.fr');
utils.define(optionsMatchInfos, 'port', 80);
utils.define(optionsMatchInfos, 'path', '/competitions/php/competition/competition_match_detail_v2.php?o=1&t=1&ma_no=');
utils.define(optionsMatchInfos, 'activated', true);


var optionsCalendrierExcellencePathBase = '/competitions/php/championnat/championnat_calendrier_resultat.php?typ_rech=journee&cp_no=305257&ph_no=1&gp_no=&sa_no=2014&pj_no=';
var optionsCalendrierExcellence = Object.create(null);
utils.define(optionsCalendrierExcellence, 'host', 'district-foot-65.fff.fr');
utils.define(optionsCalendrierExcellence, 'port', 80);
utils.define(optionsCalendrierExcellence, 'path', '/competitions/php/championnat/championnat_calendrier_resultat.php?typ_rech=journee&cp_no=305257&ph_no=1&gp_no=&sa_no=2014&pj_no=');

exports.downloadOptions = {
	classement:optionsClassement,
	calendrier:optionsCalendrier,
	actus:optionsActus,
    agenda:optionsAgenda,
    agendaBase:optionsAgendaPathBase,
    matchInfos:optionsMatchInfos,
    matchInfosBase:optionsMatchInfosPathBase,
    calendrierExcellence:optionsCalendrierExcellence,
    calendrierExcellenceBase:optionsCalendrierExcellencePathBase
};