var Logger = (function () {
    function Logger(name) {
        this._name = name;
    }
    Logger.prototype.info = function (message) {
        console.log('[INFO] [' + this._name + '] : ' + message);
    };
    Logger.prototype.warning = function (message) {
        console.log('[WARNING] [' + this._name + '] : ' + message);
    };
    Logger.prototype.errorMessage = function (message) {
        console.log('[ERROR] [' + this._name + '] : ' + message);
    };
    Logger.prototype.error = function (message, err) {
        console.error('[ERROR] [' + this._name + '] : ' + message, err);
    };
    Logger.prototype.debug = function (message) {
        var isDebug = (process.env.NODE_ENV === 'DEV');
        if (isDebug) {
            console.log('[DEBUG] [' + this._name + '] : ' + message);
        }
    };
    return Logger;
})();
module.exports = Logger;
