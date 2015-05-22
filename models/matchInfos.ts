export class MatchInfos {
	private _nom: string;
	private _adresse: string;
	private _ville: string;
	private _arbitres: Array<string>;
	
	public get nom() : string {
		return this._nom;
	}
	
	public set nom(v : string) {
		this._nom = v;
	}
	
	public get adresse() : string {
		return this._adresse;
	}
	
	public set adresse(v : string) {
		this._adresse = v;
	}
	public get ville() : string {
		return this._ville;
	}
	
	public set ville(v : string) {
		this._ville = v;
	}
	public get arbitres() : Array<string> {
		return this._arbitres;
	}
	
	public set arbitres(v : Array<string>) {
		this._arbitres = v;
	}
	
}