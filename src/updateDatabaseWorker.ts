/// <reference path="../typings/tsd.d.ts" />
import parser = require('./parsers/parser_node_module');
import parserdistrict = require('./parsers/parser_district_node_module');
import constants = require('./constants/constants');

process.on('message', function(m) {
  if (m === 'updateDatabase') {
      parser.updateDatabase();    
  } else if (m === 'updateJournee') {
    var nbJournee = constants.params.SEASON_MATCHS_COUNT_EQUIPE1;
    for(var i = 1; i<=nbJournee; i++)
        parserdistrict.updateDatabaseJournee(i, 'equipe1');
        
    var nbJournee = constants.params.SEASON_MATCHS_COUNT_EQUIPE2;
    for(var i = 1; i<=nbJournee; i++)
        parserdistrict.updateDatabaseJournee(i, 'equipe2');
        
    var nbJournee = constants.params.SEASON_MATCHS_COUNT_EQUIPE3;
    for(var i = 1; i<=nbJournee; i++)
        parserdistrict.updateDatabaseJournee(i, 'equipe3');
  }
});