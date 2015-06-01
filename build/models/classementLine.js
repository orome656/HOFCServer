var ClassementLine = (function () {
    function ClassementLine() {
    }
    ClassementLine.prototype.toString = function () {
        return '{"nom":"' + this.nom + '","joue":"' + this.joue + '","points":"' + this.points + '","gagne":"' + this.gagne + '","nul":"' + this.nul + '","perdu":"' + this.perdu + '","bp":"' + this.bp + '","bc":"' + this.bc + '","diff":"' + this.diff + '"}';
    };
    return ClassementLine;
})();
module.exports = ClassementLine;
