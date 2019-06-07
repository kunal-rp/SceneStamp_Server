var fs = require('fs');

module.exports = {

	//Get methods
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

		if(params.series_id == null){
			series_data = this.getAllSeries();
		}else{
			series_data = this._getData(this.getAllSeries(), function(series){return series.series_id}, this._getArray(params.series_id).map(function(id){return parseInt(id);}));		
		}
		episode_ids = this.getEpisodesFromSeries(false, series_data.map(function(series){return series.series_id})).map(function(episode){return episode.episode_id});
		timestamp_data = this.getTimestampsFromEpisode(false, episode_ids);

		if(params.episode_id != null){
			new_timestamp_data = this._getData(timestamp_data, function(timestamp){return timestamp.episode_id}, this._getArray(params.episode_id));
			timestamp_data = new_timestamp_data;
		}

		if(params.character_id != null){
			new_timestamp_data = timestamp_data.filter(function(timestamp){ 
					return t._intersect(timestamp.characters, t._getArray(params.character_id).map(id => parseInt(id))).length > 0
				});
			timestamp_data = new_timestamp_data;
		}

		if(params.category_id != null){
			new_timestamp_data = timestamp_data.filter(function(timestamp){ 
					return t._intersect(timestamp.categories, t._getArray(params.category_id).map(id => parseInt(id))).length > 0
				});
			timestamp_data = new_timestamp_data;
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
		c = [...a];
		d = [...b];
		  var result = [];
		  while( c.length > 0 && d.length > 0 )
		  {  
		     if      (c[0] < d[0] ){ c.shift(); }
		     else if (c[0] > d[0] ){ d.shift(); }
		     else /* they're equal */
		     {
		       result.push(c.shift());
		       d.shift();
		     }
		  }
		  return result;
	},

	//Post methods
	postNewSeries(name){
		console.log(name)
		if(typeof name !== String){
			return this._generateError('series name must be provided');
		}
		series_data = JSON.parse(fs.readFileSync('assets/mocks/series_data.json','utf8'));
		var id = this._generateId(5);
		while(series_data.filter(function(series){ return series.series_id === id}).length > 0){
			id = this._generateId(5);
		}
		if(series_data.map(function(series){return series.name.toLowerCase()}).includes(name.toLowerCase())){
			return this._generateError("series exists with same name");
		}
		var new_series = 
			{
				'series_id': id,
				'name': name
			};
		series_data.push(new_series);
		this._updateFile('assets/mocks/series_data.json', series_data);
		return new_series	;
	}, 

	_generateId(length){
		return (10 ^ (length-1)) + Math.floor( + Math.random() * 9 * (10 ^ (length-1)));
	},
	_updateFile(file, data, callback){
		fs.writeFileSync(file, '');
		fs.writeFileSync(file, JSON.stringify(data));

	},
	_generateError(desc){
		return {'error':desc};
	}
}

