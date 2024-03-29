var fs = require('fs');

var bodyParser = require('body-parser'),
    express = require('express'),
    gm = require('gm');

var db = require('./db.js');


var app = express();
app.use(bodyParser());


var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];


function generateCode(n){

    var res = ""; 
    for(var i = 0; i < n ; i ++) {
        var id = Math.ceil(Math.random()*61);
        res += chars[id];
     }
     return res;
     
}


function generateImage(res,code){

    gm(80, 20, "#ddff99f3")
    .drawText(16, 15, code)
    .stream('png')
    .pipe(res)

} 


app.get('/', function(req, res){
    
    res.send("hello!");

});


app.get('/image', function(req, res){

    var ak = req.query.ak || "",
        rc = req.query.rc || "";
    var code;
    res.set({
        'Content-Type': 'image/png',
        'Access-Control-Allow-Origin': '*'
    })
    if (ak.length != 24 && rc.length != 6){
        code = "Opoos!";
    }
    else{
        code = generateCode(6);
    }
    db.getImageMthod(ak, rc, code);
    generateImage(res, code);

});


app.post('/verify', function(req, res){

    var ak = req.body.ak || "",
        sk = req.body.sk || "",
        rc = req.body.rc || "",
        input_code = req.body.input_code || "";

    res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    })
    
    db.verify(ak, sk, rc, input_code, function(status){
        res.send(status);
    });

})



module.exports = app ;

