var express = require('express');
var crypto = require('crypto');
var app = express();
var fs = require('fs');
var iconv = require('iconv-lite')
var db =  require('./lib/db.js');
var config =  require('./config.js')
var code = require('./lib/code.js')
var bodyParser = require('body-parser');

//var num = Math.floor(Math.random()*config.init_num);

var dict = {"new": "", "old": ""};

code.GetImage(function(err,result){
dict.old = result;
})

code.GetImage(function(err,result){
dict.new = result;
})

console.log(dict);

app.use('/img', express.static(__dirname + '/img'));
app.use(bodyParser());
app.get('/', function(req, res){
  //var num = Math.floor(Math.random()*config.init_num);
  code.GetImage(function(err,result){
  res.set({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
})
  
  res.send(dict.old);
  dict.old = dict.new;
  dict.new = result;

});
});


app.get('/img', function(req, res){
    code.GetImage(function(err, result){
    res.send("<img src=\""+dict.old.domain+dict.old.url+"\"\/>");
    dict.old = dict.new;
    dict.new = result;
});
});



app.get('/recaptcha.js', function(req, res){
	var rs = fs.createReadStream('./lib/recaptcha.js');
	var data = '';
	rs.on("data", function(trunk){
	data += trunk;
	});
	rs.on("end", function(){
		res.end(data);
	});
})




app.get('/key', function(req, res){
  var key = req.query.key;
  
  code.GetImage(function(err,result){
  res.set({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
})
  var tcode = dict.old.code + key;
  scode  = crypto.createHash('md5').update(tcode, 'utf8').digest("hex"); 
  res.send({"key": key ,"code": dict.old.code, "scode": scode, "url": dict.old.domain + dict.old.url });
  console.log({"key": key ,"code": dict.old.code, "scode": scode, "url": dict.old.domain + dict.old.url })
  dict.old = dict.new;
  dict.new = result;

});
});



app.post('/verify', function(req, res){

  var key = req.body.key || "";
  var scode = req.body.scode || "";
  var input_code = req.body.input_code || "";
  
  console.log(key,scode,input_code);
  var tcode = input_code + key;
  mcode  = crypto.createHash('md5').update(tcode, 'utf8').digest("hex");
  var status = false;
  console.log(mcode);
  if (scode == mcode)  status = true;
  res.set({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
  })
  res.send({"status":status});
/*
res.set({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
  })
  //res.send(req.body+req.params);
  //console.log('------------------------------------------------------------------')
 // console.log(req);
  //console.log('-----------------------------------------------------------------')
 // console.log(res);
  //console.log('---------------------------------------------------------------')
  /*
  console.log(req.bodyParser);
  console.log('-------------------');
  console.log(req.body);
 
console.log(req.body); 
res.send('Post Over');  
*/  
  
});




app.listen(3000);
console.log('Listening on port 3000');
