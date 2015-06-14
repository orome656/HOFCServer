import Match = require('../models/match');
import ClassementLine = require('../models/classementLine');
import Actu = require('../models/actu');

interface IDatabase {
	init(): void;
	insertCalendarLine(match: Match): void;
	insertRankingLine(line: ClassementLine): void; 
	inertActusLine(actu: Actu): void;
	updateCalendarLine(match: Match): void;
	updateRankingLine(line: ClassementLine): void;
	updateActusLine(actu: Actu): void;
	getCalendarInfos(success :((res: Array<Match>) => void), fail: Function): void;
	getRankingInfos(success: ((res: Array<ClassementLine>) => void), fail: Function): void;
	getActusInfos(success: ((res: Array<Actu>) => void), fail: Function): void;
	insertNotificationId(notificationId: string, uuid: string, success: Function, fail: Function): void;
	getRankByName(nom: string, success: Function, fail: Function): void;
	getMatchByName(equipe1: string, equipe2: string, success: Function, fail: Function): void;
	getActuById(id: string, success: Function, fail: Function): void;
	getNotificationClients(success: Function, fail: Function): void;
}

export = IDatabase;