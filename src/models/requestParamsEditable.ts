import RequestParams = require('./requestParams');
class RequestParamsEditable extends RequestParams {
	public basePath: string;
	constructor(host: string, port: number, path: string, activated: boolean, basePath: string) {
		super(host, port, path, activated);
		this.basePath = basePath;
	}
}

export = RequestParamsEditable;