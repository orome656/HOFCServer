/**
 * Contient les constantes spécifiques au site district-foot-65.fff.fr
 */
/*jslint node: true */
import RequestParamsReq = require('../models/requestParams');
var RequestParams = RequestParamsReq.RequestParams;
var RequestParamsEditable = RequestParamsReq.RequestParamsEditable;
// Paramétrage url

var optionsClassement = new RequestParams(
    'www.fff.fr',
    80,
    '/championnats/fff/district-hautes-pyrenees/2014/305257-excellence/phase-1/poule-1/derniers-resultats',
    true
);

var optionsCalendrier = new RequestParams(
    'www.fff.fr',
    80,
    '/la-vie-des-clubs/177005/calendrier/liste-matchs-a-venir/305257/phase-1/groupe-1',
    true
);

var optionsActus = new RequestParams(
    'www.hofc.fr',
    80,
    '/category/seniors/',
    true
);


var optionsAgenda = new RequestParamsEditable(
    'district-foot-65.fff.fr',
    80,
    '/competitions/php/club/club_agenda.php?cl_no=177005&deb_semaine=',
    true,
    '/competitions/php/club/club_agenda.php?cl_no=177005&deb_semaine='
);

var optionsMatchInfos = new RequestParamsEditable(
    'district-foot-65.fff.fr',
    80,
    '/competitions/php/competition/competition_match_detail_v2.php?o=1&t=1&ma_no=',
    true,
    '/competitions/php/competition/competition_match_detail_v2.php?o=1&t=1&ma_no='
);

var optionsCalendrierExcellence = new RequestParamsEditable(
    'district-foot-65.fff.fr',
    80,
    '/competitions/php/championnat/championnat_calendrier_resultat.php?typ_rech=journee&cp_no=305257&ph_no=1&gp_no=&sa_no=2014&pj_no=',
    true,
    '/competitions/php/championnat/championnat_calendrier_resultat.php?typ_rech=journee&cp_no=305257&ph_no=1&gp_no=&sa_no=2014&pj_no='
);

export module Constants_District {
	export var classement = optionsClassement;
	export var calendrier = optionsCalendrier;
	export var actus = optionsActus;
    export var agenda = optionsAgenda;
    export var matchInfos = optionsMatchInfos;
    export var calendrierExcellence = optionsCalendrierExcellence;
};