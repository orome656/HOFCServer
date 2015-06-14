class ClassementLine {
	public id: number;
	public nom: string;
	public joue: number;
	public points: number;
	public gagne: number;
	public nul: number;
	public perdu: number;
	public bp: number;
	public bc: number;
	public diff: number;
		
	fromObject(object) {
		this.id = object.id;
		this.nom = object.nom;
		this.joue = object.joue;
		this.points = object.points;
		this.gagne = object.gagne;
		this.nul = object.nul;
		this.perdu = object.perdu;
		this.bp = object.bp;
		this.bc = object.bc;
		this.diff = object.diff;
	}
	
	toString(): string {
		return '{"nom":"'+this.nom+'","joue":"'+this.joue+'","points":"'+this.points+'","gagne":"'+this.gagne+'","nul":"'+this.nul+'","perdu":"'+this.perdu+'","bp":"'+this.bp+'","bc":"'+this.bc+'","diff":"'+this.diff+'"}'
	}
}

export = ClassementLine;