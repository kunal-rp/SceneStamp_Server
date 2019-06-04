var fs = require('fs');

module.exports = {

	getAllSeries(){
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
				return episode.episode_id.split("_")[0] === series_id.toString();
			});

	},
	getAllCategories(){
		episode_data = JSON.parse(fs.readFileSync('assets/mocks/categories_data.json'));
		return episode_data;
	},
	getTimestampsFromEpisode(episode_id){
		var t = this;
		timestamp_data = JSON.parse(fs.readFileSync('assets/mocks/timestamp_data.json'))
							.filter(function(timestamp){
								return timestamp.episode_id === episode_id.toString();
		});
		timestamp_data.forEach(function(timestamp){
			timestamp.characters = t.getCharactersForTimestamp(timestamp.timestamp_id);
			timestamp.categories = t.getCategoriesForTimestamp(timestamp.timestamp_id);
		});
		return timestamp_data;

	},
	getCategoriesForTimestamp(timestamp_id){
		ct_data = JSON.parse(fs.readFileSync('assets/mocks/CategoryToTimestamp_relation.json'));
		return ct_data.filter(function(relation){
				return relation.timestamp_id === timestamp_id.toString();
			}).map(function(category){return category.category_id});

	},
	getCharactersForTimestamp(timestamp_id){
		ct_data = JSON.parse(fs.readFileSync('assets/mocks/CharacterToTimestamp_relation.json'));
		return ct_data.filter(function(relation){
				return relation.timestamp_id === timestamp_id.toString();
			}).map(function(character){return character.character_id});

	}
}