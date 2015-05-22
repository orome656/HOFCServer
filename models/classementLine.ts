export class ClassementLine {
	private _id: number;
	private _nom: string;
	private _joue: number;
	private _points: number;
	private _gagne: number;
	private _nul: number;
	private _perdu: number;
	private _bp: number;
	private _bc: number;
	private _diff: number;
	
	get id(): number {
		return this._id;
	}
	set id(id: number) {
		this._id = id;
	} 
	get nom(): string {
		return this._nom;
	}
	set nom(nom: string) {
		this._nom = nom;
	} 
	get joue(): number {
		return this._joue;
	}
	set joue(joue: number) {
		this._joue = joue;
	} 
	get points(): number {
		return this._points;
	}
	set points(points: number) {
		this._points = points;
	} 
	get gagne(): number {
		return this._joue;
	}
	set gagne(gagne: number) {
		this._gagne = gagne;
	} 
	get nul(): number {
		return this._nul;
	}
	set nul(nul: number) {
		this._nul = nul;
	} 
	get perdu(): number {
		return this._perdu;
	}
	set perdu(perdu: number) {
		this._perdu = perdu;
	} 
	get bp(): number {
		return this._bp;
	}
	set bp(bp: number) {
		this._bp = bp;
	} 
	get bc(): number {
		return this._bc;
	}
	set bc(bc: number) {
		this._bc = bc;
	} 
	get diff(): number {
		return this._diff;
	}
	set diff(diff: number) {
		this._diff = diff;
	}
}