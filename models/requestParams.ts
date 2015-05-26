export class RequestParams {
	public host: string;
	public port: number;
	public path: string;
	public activated: boolean;
	constructor(host: string, port: number, path: string, activated: boolean) {
		this.host = host;
		this.port = port;
		this.path = path;
		this.activated = activated;
	}
}

export class RequestParamsEditable extends RequestParams {
	public basePath: string;
	constructor(host: string, port: number, path: string, activated: boolean, basePath: string) {
		super(host, port, path, activated);
		this.basePath = basePath;
	}
}