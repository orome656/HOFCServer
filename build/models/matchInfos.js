var MatchInfos = (function () {
    function MatchInfos() {
    }
    Object.defineProperty(MatchInfos.prototype, "nom", {
        get: function () {
            return this._nom;
        },
        set: function (v) {
            this._nom = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatchInfos.prototype, "adresse", {
        get: function () {
            return this._adresse;
        },
        set: function (v) {
            this._adresse = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatchInfos.prototype, "ville", {
        get: function () {
            return this._ville;
        },
        set: function (v) {
            this._ville = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatchInfos.prototype, "arbitres", {
        get: function () {
            return this._arbitres;
        },
        set: function (v) {
            this._arbitres = v;
        },
        enumerable: true,
        configurable: true
    });
    return MatchInfos;
})();
module.exports = MatchInfos;
