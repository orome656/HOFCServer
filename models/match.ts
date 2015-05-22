export class Match {
	private _equipe1: string;
	private _equipe2: string;
	private _score1: number;
	private _score2: number;
	private _date: string; // TODO: Voir pour changer en Date
	private _infosId: string;
	get equipe1(): string {
		return this._equipe1;
	}
	set equipe1(equipe1: string) {
		this._equipe1 = equipe1;
	}
	get equipe2(): string {
		return this._equipe2;
	} 
	set equipe2(equipe2: string) {
		this._equipe2 = equipe2;
	} 
	get score1(): number {
		return this._score1;
	}
	set score1(score1: number) {
		this._score1 = score1;
	}
	get score2(): number {
		return this._score2;
	} 
	set score2(score2: number) {
		this._score2 = score2;
	} 
	get date(): string {
		return this._date;
	} 
	set date(date: string) {
		this._date = date;
	} 
	get infosId(): string {
		return this._infosId;
	} 
	set infosId(infosId: string) {
		this._infosId = infosId;
	} 
	
}