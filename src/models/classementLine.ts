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
	
	toString(): string {
		return '{"nom":"'+this.nom+'","joue":"'+this.joue+'","points":"'+this.points+'","gagne":"'+this.gagne+'","nul":"'+this.nul+'","perdu":"'+this.perdu+'","bp":"'+this.bp+'","bc":"'+this.bc+'","diff":"'+this.diff+'"}'
	}
}

export = ClassementLine;