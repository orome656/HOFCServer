var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Match = require('./match');
var Utils = require('../utils/utils');
var MatchAgenda = (function (_super) {
    __extends(MatchAgenda, _super);
    function MatchAgenda() {
        _super.apply(this, arguments);
    }
    MatchAgenda.prototype.formatDate = function () {
        return Utils.formatDateAgenda(new Date(this.date));
    };
    MatchAgenda.prototype.toString = function () {
        var match = _super.prototype.toString.call(this);
        match = match.substring(0, match.length - 1);
        return match + ', "infos":"' + this.infos + '", "title":"' + this.title + '"}';
    };
    return MatchAgenda;
})(Match);
module.exports = MatchAgenda;
