/**
 * Contient les constantes spécifiques au site district-foot-65.fff.fr
 */
/*jslint node: true */
import RequestParams = require('../models/requestParams');
var RequestParamsEditable = require('../models/requestParamsEditable');
// Paramétrage url

var optionsClassement = new RequestParams(
    'district-foot-65.fff.fr',
    80,
    '/competitions/php/championnat/championnat_classement.php?sa_no=2016&cp_no=328367&ph_no=1&gp_no=',
    true
);

var optionsClassementEquipe2 = new RequestParams(
    'district-foot-65.fff.fr',
    80,
    '/competitions/php/championnat/championnat_classement.php?sa_no=2016&cp_no=328368&ph_no=1&gp_no=',
    true
);

var optionsClassementEquipe3 = new RequestParams(
    'district-foot-65.fff.fr',
    80,
    '/competitions/php/championnat/championnat_classement.php?sa_no=2016&cp_no=328369&ph_no=1&gp_no=2',
    true
);

var arrayOptionsClassement = {
    'equipe1': optionsClassement,
    'equipe2': optionsClassementEquipe2,
    'equipe3': optionsClassementEquipe3
}

var optionsCalendrier = new RequestParams(
    'district-foot-65.fff.fr',
    80,
    '/competitions/php/championnat/championnat_calendrier_resultat.php?cp_no=328367&ph_no=1&gp_no=&sa_no=2016&typ_rech=equipe&cl_no=177005&eq_no=1&type_match=deux&lieu_match=deux',
    true
);


var optionsCalendrierEquipe2 = new RequestParams(
    'district-foot-65.fff.fr',
    80,
    '/competitions/php/championnat/championnat_calendrier_resultat.php?cp_no=328368&ph_no=1&gp_no=&sa_no=2016&typ_rech=equipe&cl_no=177005&eq_no=2&type_match=deux&lieu_match=deux',
    true
);


var optionsCalendrierEquipe3 = new RequestParams(
    'district-foot-65.fff.fr',
    80,
    '/competitions/php/championnat/championnat_calendrier_resultat.php?cp_no=328369&ph_no=1&gp_no=2&sa_no=2016&typ_rech=equipe&cl_no=177005&eq_no=3&type_match=deux&lieu_match=deux',
    true
);

var arrayOptionsCalendrier = {
    'equipe1': optionsCalendrier,
    'equipe2': optionsCalendrierEquipe2,
    'equipe3': optionsCalendrierEquipe3
}

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
    '/competitions/php/championnat/championnat_calendrier_resultat.php?typ_rech=journee&cp_no=328367&ph_no=1&gp_no=&sa_no=2016&pj_no=',
    true,
    '/competitions/php/championnat/championnat_calendrier_resultat.php?typ_rech=journee&cp_no=328367&ph_no=1&gp_no=&sa_no=2016&pj_no='
);

var optionsCalendrierPremiereDiv = new RequestParamsEditable(
    'district-foot-65.fff.fr',
    80,
    '/competitions/php/championnat/championnat_calendrier_resultat.php?typ_rech=journee&cp_no=328368&ph_no=1&gp_no=&sa_no=2016&pj_no=',
    true,
    '/competitions/php/championnat/championnat_calendrier_resultat.php?typ_rech=journee&cp_no=328368&ph_no=1&gp_no=&sa_no=2016&pj_no='
);

var optionsCalendrierPromotionPremiereDiv = new RequestParamsEditable(
    'district-foot-65.fff.fr',
    80,
    '/competitions/php/championnat/championnat_calendrier_resultat.php?typ_rech=journee&cp_no=328369&ph_no=1&gp_no=2&sa_no=2016&pj_no=',
    true,
    '/competitions/php/championnat/championnat_calendrier_resultat.php?typ_rech=journee&cp_no=328369&ph_no=1&gp_no=2&sa_no=2016&pj_no='
);

var optionsCalendrierByJourneeArray = {
    'equipe1': optionsCalendrierExcellence,
    'equipe2': optionsCalendrierPremiereDiv,
    'equipe3': optionsCalendrierPromotionPremiereDiv
}

module Constants_District {
	export var classement = optionsClassement;
	export var arrayClassement = arrayOptionsClassement;
	export var calendrier = optionsCalendrier;
	export var arrayCalendrier = arrayOptionsCalendrier;
	export var actus = optionsActus;
    export var agenda = optionsAgenda;
    export var matchInfos = optionsMatchInfos;
    export var calendrierExcellence = optionsCalendrierExcellence;
    export var calendrierByJournee = optionsCalendrierByJourneeArray;
};

export = Constants_District;