var Utils = require('../utils/utils');
var Actu = (function () {
    function Actu() {
    }
    Actu.prototype.toString = function () {
        return '{"postid":"' + this.postId + '","titre":"' + this.titre + '","texte":"' + this.texte + '","url":"' + this.url + '","image":"' + this.image + '","date":"' + Utils.formatDate(new Date(this.date)) + '"}';
    };
    return Actu;
})();
module.exports = Actu;
