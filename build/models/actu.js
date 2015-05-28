var Actu = (function () {
    function Actu() {
    }
    Object.defineProperty(Actu.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actu.prototype, "postId", {
        get: function () {
            return this._postId;
        },
        set: function (postId) {
            this._postId = postId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actu.prototype, "titre", {
        get: function () {
            return this._titre;
        },
        set: function (titre) {
            this._titre = titre;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actu.prototype, "texte", {
        get: function () {
            return this._texte;
        },
        set: function (texte) {
            this._texte = texte;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actu.prototype, "url", {
        get: function () {
            return this._url;
        },
        set: function (url) {
            this._url = url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actu.prototype, "image", {
        get: function () {
            return this._image;
        },
        set: function (image) {
            this._image = image;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actu.prototype, "date", {
        get: function () {
            return this._date;
        },
        set: function (date) {
            this._date = date;
        },
        enumerable: true,
        configurable: true
    });
    return Actu;
})();
module.exports = Actu;
