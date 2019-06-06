var fs = require('fs');

module.exports = {

	getAllSeries(){
		series_data = JSON.parse(fs.readFileSync('assets/mocks/series_data.json','utf8'));
		return series_data;
	},

	getCharacterDataFromSeries(series_id){
		return this._getData(
			JSON.parse(fs.readFileSync('assets/mocks/character_data.json')),
			function(character){
				return character.series_id
			},
			this._getArray(series_id).map(
				function(id){
					return parseInt(id);
				}));
	},
	getEpisodesFromSeries(external,series_id){
		return this._getData(
			JSON.parse(fs.readFileSync('assets/mocks/episode_data.json')),
			function(episode){
				return parseInt(episode.episode_id.split('_')[0])
			},
			(external ? 
				this._getArray(series_id).map(
					function(id){
						return parseInt(id);
					}) 
				:
				series_id)
			);
	},
	getAllCategories(){
		episode_data = JSON.parse(fs.readFileSync('assets/mocks/categories_data.json'));
		return episode_data;
	},
	getTimestampsFromEpisode(external, episode_id){
		var t = this;
		timestamp_data = this._getData(
			JSON.parse(fs.readFileSync('assets/mocks/timestamp_data.json')),
			function(timestamp){
				return timestamp.episode_id.toString()
			},
			(external ? this._getArray(episode_id) : episode_id));

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

	},
	queryForTimestamps(params){
		var t = this;
		//get all episodes from series id provided
		//filter out for episodes thats provided

		//get list of all episodes
		//get all timestamps
		//filter for categories
		//filter for characters

		if(params.series_id == null){
			params.series_id = this.getAllSeries().map(function(series){return series.series_id});
		}
		series_data = this._getData(this.getAllSeries(), function(series){return series.series_id}, this._getArray(params.series_id).map(function(id){return parseInt(id);}));
		
		episode_ids = this.getEpisodesFromSeries(false, series_data.map(function(series){return series.series_id})).map(function(episode){return episode.episode_id});

		timestamp_data = this.getTimestampsFromEpisode(false, episode_ids);

		if(params.character_id != null){
			timestamp_data = timestamp_data.filter(
				function(timestamp){ 
					console.log(timestamp.timestamp_id," ", t._intersect(timestamp.characters, t._getArray(params.character_id).map(id => parseInt(id))).length !== 0 )
					return t._intersect(timestamp.characters, t._getArray(params.character_id).map(id => parseInt(id))).length !== 0 
				});
		}

		return timestamp_data;



	},
	_getData(dataList, filterAction, list){
		return dataList.filter(function(data){
			return list.includes(filterAction(data));
		});
	},
	_getArray(parameter){
		return parameter.split(',');
	},
	_intersect(a, b){
		  var result = [];
		  while( a.length > 0 && b.length > 0 )
		  {  
		     if      (a[0] < b[0] ){ a.shift(); }
		     else if (a[0] > b[0] ){ b.shift(); }
		     else /* they're equal */
		     {
		       result.push(a.shift());
		       b.shift();
		     }
		  }
		  return result;
		}
}

