var crypto = require('crypto');
var express = require('express');
var fs = require('fs');

var bodyParser = require('body-parser');

var config =  require('./config.js'),
    code = require('./lib/code.js');
   // db =  require('./lib/db.js');

var app = express(),
    pool = {"new": "", "old": ""};


// pool init with two data
code.GetImage(function(err,result){
    pool.old = result;
})

code.GetImage(function(err,result){
    pool.new = result;
})

//console.log(pool);

app.use('/img', express.static(__dirname + '/img'));
app.use(bodyParser());


app.get('/', function(req, res){

    code.GetImage(function(err,result){
    res.set({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
})
    
    res.send(pool.old);
    pool.old = pool.new;
    pool.new = result;

});
});


app.get('/img', function(req, res){

    code.GetImage(function(err, result){
    res.send("<img src=\""+pool.old.domain+pool.old.url+"\"\/>");
    pool.old = pool.new;
    pool.new = result;

});
});



app.get('/recaptcha.js', function(req, res){

  	var rs = fs.createReadStream('./lib/recaptcha.js');
    var data = '';
    rs.on("data", function(trunk){data += trunk;});
    rs.on("end", function(){res.end(data);});

})




app.get('/key', function(req, res){

    var key = req.query.key;
    code.GetImage(function(err,result){
    res.set({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'})

    var tcode = pool.old.code + key;
    var scode  = crypto.createHash('md5').update(tcode, 'utf8').digest("hex"); 
    res.send({"key": key ,"code": pool.old.code, "scode": scode, "url": pool.old.domain + pool.old.url });
    //console.log({"key": key ,"code": pool.old.code, "scode": scode, "url": pool.old.domain + pool.old.url })
    pool.old = pool.new;
    pool.new = result;

});
});



app.post('/verify', function(req, res){
    
    var key = req.body.key || "";
    var scode = req.body.scode || "";
    var input_code = req.body.input_code || "";
    var tcode = input_code + key;
    var mcode  = crypto.createHash('md5').update(tcode, 'utf8').digest("hex");
    var status = false;

    //console.log(key,scode,input_code);  
    //console.log(mcode);
    if (scode == mcode)  status = true;

    res.set({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'})
    res.send({"status":status});

});




app.listen(3000);
console.log('Listening on port 3000');
