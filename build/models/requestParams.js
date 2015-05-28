var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RequestParams = (function () {
    function RequestParams(host, port, path, activated) {
        this.host = host;
        this.port = port;
        this.path = path;
        this.activated = activated;
    }
    return RequestParams;
})();
exports.RequestParams = RequestParams;
var RequestParamsEditable = (function (_super) {
    __extends(RequestParamsEditable, _super);
    function RequestParamsEditable(host, port, path, activated, basePath) {
        _super.call(this, host, port, path, activated);
        this.basePath = basePath;
    }
    return RequestParamsEditable;
})(RequestParams);
exports.RequestParamsEditable = RequestParamsEditable;
