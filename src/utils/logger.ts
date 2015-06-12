/// <reference path="../../typings/tsd.d.ts" />
class Logger {
	private _name: string
	constructor(name: string) {
		this._name = name;
	}
	
	public info(message: string) {
		console.log('[INFO] [' + this._name + '] : ' + message);
	}
	
	public warning(message: string) {
		console.log('[WARNING] [' + this._name + '] : ' + message);
	}
	
	public errorMessage(message: string) {
		console.log('[ERROR] [' + this._name + '] : ' + message);
	}
	
	public error(message: string, err: any) {
		console.error('[ERROR] [' + this._name + '] : ' + message, err);
	}
	
	public debug(message: string) {
		var isDebug = (process.env.NODE_ENV === 'DEV');
		if(isDebug) {
			console.log('[DEBUG] [' + this._name + '] : ' + message);
		}
	}
}

export = Logger