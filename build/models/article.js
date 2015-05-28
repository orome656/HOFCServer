var Article = (function () {
    function Article() {
    }
    Object.defineProperty(Article.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (titre) {
            this._title = titre;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Article.prototype, "article", {
        get: function () {
            return this._article;
        },
        set: function (texte) {
            this._article = texte;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Article.prototype, "date", {
        get: function () {
            return this._date;
        },
        set: function (date) {
            this._date = date;
        },
        enumerable: true,
        configurable: true
    });
    return Article;
})();
module.exports = Article;
