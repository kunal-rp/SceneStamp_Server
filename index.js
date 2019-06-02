var express = require('express');
var fs = require('fs');
var app = express();

class Endpoint{

	constructor(url, testing_callback, production_callback){
		this.url = url;
		this.testing_callback = testing_callback;
		this.production_callback = production_callback;
	}

	getUrl(){
		return this.url;
	}

	testing(req, res){
		this.testing_callback(req,res);
	}

	production(req,res){
		this.production_callback(req,res);
	}
}

var endpoints = [
	new Endpoint(
		'/getAllSeries',
		function(req, res){
			res.end(fs.readFileSync('assets/mocks/series_data.json'));
		},
		function(req, res){
			res.send("production not ready yet, use testing");
		})
];

endpoints.forEach(function(endpoint){
	app.get(endpoint.getUrl(), function(req, res){
		if(req.query.testing === 'true'){
			endpoint.testing(req,res);
		}
		else{
			endpoint.production(req,res);
		}
	});
})


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
