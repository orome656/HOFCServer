var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Match = require('./match');
var MatchAgenda = (function (_super) {
    __extends(MatchAgenda, _super);
    function MatchAgenda() {
        _super.apply(this, arguments);
    }
    return MatchAgenda;
})(Match);
module.exports = MatchAgenda;
