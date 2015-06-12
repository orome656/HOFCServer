import Utils = require('../utils/utils');
class Actu {
	public id: number;
	public postId: string;
	public titre: string;
	public texte: string;
	public url: string;
	public image: string;
	public date: string; // TODO: voir pour changer en Date
	
	toString(): string {
		return '{"postid":"'+this.postId+'","titre":"'+this.titre+'","texte":"'+this.texte+'","url":"'+this.url+'","image":"'+this.image+'","date":"'+Utils.formatDate(new Date(this.date))+'"}';
	}
}

export = Actu;