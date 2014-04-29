var code = require('../lib/code.js');
var fs = require('fs');


code.GetImage(function(err,result){
    if (err) return console.log("error:"+ err);
    else{
    console.log(".."+ result.url.toString());
        fs.exists(".."+ result.url.toString(), function(exists){
        if (exists) return console.log('ok');
        else return console.log('fail!'+ ".." + result.url.toString());
        });
    };
});



/*



fs.exists("../img/1/bd4af0c2.jpg", function(exists){
        if (exists) return console.log('ok');
        else return console.log('fail!');
*/
