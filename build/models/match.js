var Match = (function () {
    function Match() {
    }
    Object.defineProperty(Match.prototype, "equipe1", {
        get: function () {
            return this._equipe1;
        },
        set: function (equipe1) {
            this._equipe1 = equipe1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Match.prototype, "equipe2", {
        get: function () {
            return this._equipe2;
        },
        set: function (equipe2) {
            this._equipe2 = equipe2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Match.prototype, "equipe1Complet", {
        get: function () {
            return this._equipe1Complet;
        },
        set: function (equipe1Complet) {
            this._equipe1Complet = equipe1Complet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Match.prototype, "equipe2Complet", {
        get: function () {
            return this._equipe2Complet;
        },
        set: function (equipe2Complet) {
            this._equipe2Complet = equipe2Complet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Match.prototype, "score1", {
        get: function () {
            return this._score1;
        },
        set: function (score1) {
            this._score1 = score1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Match.prototype, "score2", {
        get: function () {
            return this._score2;
        },
        set: function (score2) {
            this._score2 = score2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Match.prototype, "date", {
        get: function () {
            return this._date;
        },
        set: function (date) {
            this._date = date;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Match.prototype, "infosId", {
        get: function () {
            return this._infosId;
        },
        set: function (infosId) {
            this._infosId = infosId;
        },
        enumerable: true,
        configurable: true
    });
    return Match;
})();
module.exports = Match;
