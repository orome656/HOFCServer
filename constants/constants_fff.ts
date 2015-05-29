/**
 * Contient les constantes spécifiques au site fff.fr
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
	export var actus = optionsActus
    export var agenda = optionsAgenda
    export var matchInfos = optionsMatchInfos
}

export = Constants_FFF;