import Match = require('./match');
import Utils = require('../utils/utils');

class MatchAgenda extends Match {
	public title: string;
	
	formatDate(): string {
		return Utils.formatDateAgenda(new Date(this.date));
	}
	
	toString(): string {
		var match = super.toString();
		match = match.substring(0, match.length - 1);
		
		return match + ', "infos":"'+this.infos+'", "title":"'+this.title+'"}'
	}
}
export = MatchAgenda;