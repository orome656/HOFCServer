var RequestParamsReq = require('../models/requestParams');
var RequestParams = RequestParamsReq.RequestParams;
var RequestParamsEditable = RequestParamsReq.RequestParamsEditable;
var optionsClassement = new RequestParams('www.fff.fr', 80, '/championnats/fff/district-hautes-pyrenees/2014/305257-excellence/phase-1/poule-1/derniers-resultats', true);
var optionsCalendrier = new RequestParams('www.fff.fr', 80, '/la-vie-des-clubs/177005/calendrier/liste-matchs-a-venir/305257/phase-1/groupe-1', true);
var optionsActus = new RequestParams('www.hofc.fr', 80, '/category/seniors/', true);
var optionsAgenda = new RequestParamsEditable('www.fff.fr', 80, '/la-vie-des-clubs/177005/agenda', true, '/la-vie-des-clubs/177005/agenda');
var optionsMatchInfos = new RequestParamsEditable('www.fff.fr', 80, '/match/fff/16806038/detail', true, '/match/fff/{id}/detail');
var Constants_FFF;
(function (Constants_FFF) {
    Constants_FFF.classement = optionsClassement;
    Constants_FFF.calendrier = optionsCalendrier;
    Constants_FFF.actus = optionsActus;
    Constants_FFF.agenda = optionsAgenda;
    Constants_FFF.matchInfos = optionsMatchInfos;
})(Constants_FFF = exports.Constants_FFF || (exports.Constants_FFF = {}));
