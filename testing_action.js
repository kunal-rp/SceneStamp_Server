var fs = require('fs');

module.exports = {

	getAllSeries(){
		var t = this;
		series_data = JSON.parse(fs.readFileSync('assets/mocks/series_data.json','utf8'));
		return series_data;
	},

	getCharacterDataFromSeries(series_id){
		character_data = JSON.parse(fs.readFileSync('assets/mocks/character_data.json'));
		return character_data.filter(function(character){
				return character.series_id.toString() === series_id.toString();
			});
	},
	getEpisodesFromSeries(series_id){
		episode_data = JSON.parse(fs.readFileSync('assets/mocks/episode_data.json'));
		return episode_data.filter(function(episode){
				return episode.id.split("_")[0] === series_id.toString();
			});

	}
}