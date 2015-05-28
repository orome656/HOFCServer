class Article {
	private _title: string;
	private _article: string;
	private _date: string; // TODO a changer en date
	
	get title(): string {
		return this._title;
	}
	set title(titre: string) {
		this._title = titre;
	}
	get article(): string {
		return this._article;
	}
	set article(texte: string) {
		this._article = texte;
	}
	get date(): string {
		return this._date;
	}
	set date(date: string) {
		this._date = date;
	}
}

export = Article;