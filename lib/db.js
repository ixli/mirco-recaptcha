var levelup = require('levelup')
var db = levelup('./db/1')
var code = require('./code.js')
var config = require('../config.js')


exports.put = function(RandomInt, info){
	return 
	db.put(RandomInt, info, function (err) {
	if (err) return console.log('Ooops!, err')
	else
	console.log('done!'+JSON.stringify(info))
})
}


exports.get = function(RandomInt){
	  db.get(RandomInt, function(err, value){
		if (!err) {
		console.log(value);
		}
		else  {
		console.log('Ooops!', err);
		}
	})
};




exports.reset = function(){
code.GenerateImage(config.init_num);
console.log('init.....');
}




