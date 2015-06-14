import Utils = require('../utils/utils');
class Actu {
	public id: number;
	public postId: string;
	public titre: string;
	public texte: string;
	public url: string;
	public image: string;
	public date: string; // TODO: voir pour changer en Date
	
	fromObject(object): void {
		this.date = object.date;
		this.id = object.id;
		this.image = object.image;
		this.postId = object.postId;
		this.texte = object.texte;
		this.titre = object.titre;
		this.url = object.url;
	}
	
	toString(): string {
		return '{"postid":"'+this.postId+'","titre":"'+this.titre+'","texte":"'+this.texte+'","url":"'+this.url+'","image":"'+this.image+'","date":"'+Utils.formatDate(new Date(this.date))+'"}';
	}
}

export = Actu;