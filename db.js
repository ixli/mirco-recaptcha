var levelup = require('levelup')


var name_ak_db = levelup('./db/name_ak_db'),     // from name find ak 
    ak_sk_db = levelup('./db/ak_sk_db'),     // from ak find sk
    ak_code_db = levelup('./db/ak_code_db'); // from ak find code


var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];


function generateCode(n) {
    var res = ""; 
    for(var i = 0; i < n ; i ++){
        var id = Math.ceil(Math.random()*61);
        res += chars[id];
    }
    return res;
}




exports.httpAddUser = function (name){

    var ak = crypto.createHash('md5').update(name + generateCode(6), 'utf8').digest("hex").substring(0,24);
    var sk = crypto.createHash('md5').update(name + generateCode(6), 'utf8').digest("hex");
    console.log(name);
    console.log(ak);
    console.log(sk);
    
    name_ak_db.put(name, ak, function(err){
        if (err) console.log(err);
    })
    
    ak_sk_db.put(ak, sk, function(err){
        if (err) console.log(err);
    })
    
    ak_code_db.put(ak, "null", function(err){
        if (err) console.log(err);
    })
    
}
    
    
exports.httpGetImageMthod = function (ak, code){

    ak_code_db.put(ak,code,function(err){
        if (err) console.log(err);
        ak_code_db.get(ak,function(err,value){
            console.log(value+"find!")
        });
    })
    
    ak_sk_db.get(ak,function(err,value){
    console.log("sk: " + value);
    })
}
    
    
exports.verify = function (ak, sk, input_code, callback){
    
    var status = {"status": ""};
    console.log("ak:"+ ak);
    ak_sk_db.get(ak,function(err,value){
        console.log(value);
        if (err){
            if ( err.notFound ){
                status.status = "your ak is not exist!";
                return callback(status);
            }
            else {
                status.status = err;
                console.log("err:"+ err);
                return callback(status);
            }

        }
        else{
            if (value != sk){
                status.status = "access deny!";
                console.log("!sk", status);
                return callback(status);
            }
            else{
                ak_code_db.get(ak,function(err,value){
                    if (value != input_code)
                    status.status = "input code is not right!";
                    else
                    status.status = "ok";
                    console.log("=sk", status);
                    return callback(status);
                });
            }
        }
    
    })
    
    
}    
    
    
    
    
    
