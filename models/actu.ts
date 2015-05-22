export class Actu {
	private _id: number;
	private _postId: string;
	private _titre: string;
	private _texte: string;
	private _url: string;
	private _image: string;
	private _date: string; // TODO: voir pour changer en Date
	get id(): number {
		return this._id;
	}
	set id(id: number) {
		this._id = id;
	}
	get postId(): string {
		return this._postId;
	}
	set postId(postId: string) {
		this._postId = postId;
	}
	get titre(): string {
		return this._titre;
	}
	set titre(titre: string) {
		this._titre = titre;
	}
	get texte(): string {
		return this._texte;
	}
	set texte(texte: string) {
		this._texte = texte;
	}
	get url(): string {
		return this._url;
	}
	set url(url: string) {
		this._url = url;
	}
	get image(): string {
		return this._image;
	}
	set image(image: string) {
		this._image = image;
	}
	get date(): string {
		return this._date;
	}
	set date(date: string) {
		this._date = date;
	}
}