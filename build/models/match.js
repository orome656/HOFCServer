var Utils = require('../utils/utils');
var Match = (function () {
    function Match() {
    }
    Match.prototype.formatDate = function () {
        return Utils.formatDate(new Date(this.date));
    };
    Match.prototype.toString = function () {
        return '{"equipe1":"' + this.equipe1 + '","equipe2":"' + this.equipe2 + '","score1":' + this.score1 + ',"score2":' + this.score2 + ',"date":"' + this.formatDate() + '"}';
    };
    return Match;
})();
module.exports = Match;
