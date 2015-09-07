/**
 * Contient les constantes spécifiques au site fff.fr
 */
/*jslint node: true */
import RequestParams = require('../models/requestParams');
var RequestParamsEditable = require('../models/requestParamsEditable');
// Paramétrage url
var optionsClassement = new RequestParams(
    'www.fff.fr',
    80,
    '/championnats/fff/district-hautes-pyrenees/2015/319539-excellence/phase-1/poule-1/derniers-resultats',
    true
);

var optionsCalendrier = new RequestParams(
    'www.fff.fr',
    80,
    '/la-vie-des-clubs/177005/calendrier/liste-matchs-a-venir/319539/phase-1/groupe-1',
    true
);

var optionsCalendrierEquipe2 = new RequestParams(
    'www.fff.fr',
    80,
    '/la-vie-des-clubs/177005/calendrier/liste-matchs-a-venir/317727/phase-1/groupe-1',
    true
);

var optionsCalendrierEquipe3 = new RequestParams(
    'www.fff.fr',
    80,
    '/la-vie-des-clubs/177005/calendrier/liste-matchs-a-venir/317728/phase-1/groupe-1',
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
    'www.fff.fr',
    80,
    '/la-vie-des-clubs/177005/agenda',
    true,
    '/la-vie-des-clubs/177005/agenda'
);


var optionsMatchInfos = new RequestParamsEditable(
    'www.fff.fr',
    80,
    '/match/fff/16806038/detail',
    true,
    '/match/fff/{id}/detail'
);

module Constants_FFF {
	export var classement = optionsClassement
	export var calendrier = optionsCalendrier
	export var arrayCalendrier = arrayOptionsCalendrier
	export var actus = optionsActus
    export var agenda = optionsAgenda
    export var matchInfos = optionsMatchInfos
}

export = Constants_FFF;