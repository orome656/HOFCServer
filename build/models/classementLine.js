var ClassementLine = (function () {
    function ClassementLine() {
    }
    Object.defineProperty(ClassementLine.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassementLine.prototype, "nom", {
        get: function () {
            return this._nom;
        },
        set: function (nom) {
            this._nom = nom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassementLine.prototype, "joue", {
        get: function () {
            return this._joue;
        },
        set: function (joue) {
            this._joue = joue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassementLine.prototype, "points", {
        get: function () {
            return this._points;
        },
        set: function (points) {
            this._points = points;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassementLine.prototype, "gagne", {
        get: function () {
            return this._joue;
        },
        set: function (gagne) {
            this._gagne = gagne;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassementLine.prototype, "nul", {
        get: function () {
            return this._nul;
        },
        set: function (nul) {
            this._nul = nul;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassementLine.prototype, "perdu", {
        get: function () {
            return this._perdu;
        },
        set: function (perdu) {
            this._perdu = perdu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassementLine.prototype, "bp", {
        get: function () {
            return this._bp;
        },
        set: function (bp) {
            this._bp = bp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassementLine.prototype, "bc", {
        get: function () {
            return this._bc;
        },
        set: function (bc) {
            this._bc = bc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassementLine.prototype, "diff", {
        get: function () {
            return this._diff;
        },
        set: function (diff) {
            this._diff = diff;
        },
        enumerable: true,
        configurable: true
    });
    return ClassementLine;
})();
module.exports = ClassementLine;
