import Utils = require('../utils/utils');
class Match {
	public categorie: string;
	public equipe1: string;
	public equipe2: string;
	public equipe1Complet: string;
	public equipe2Complet: string;
	public score1: number;
	public score2: number;
	public date: string; // TODO: Voir pour changer en Date
	public infos: string;	
	
	fromObject(object): void {
		this.date = object.date;
		this.equipe1 = object.equipe1;
		this.equipe2 = object.equipe2;
		this.infos = object.infos;
		this.score1 = object.score1;
		this.score2 = object.score2;
		this.categorie = object.categorie;
	}
	
	formatDate(): string {
		return Utils.formatDate(new Date(this.date));
	}
	
	toString(): string {
		return '{"equipe1":"'+this.equipe1+'","equipe2":"'+this.equipe2+'","score1":'+this.score1+',"score2":'+this.score2+',"date":"'+this.formatDate()+'"}'
	}
}

export = Match;