var crypto = require('crypto');

var async = require('async'),
    levelup = require('levelup');


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


function isValid(s){

    var patrn=/^[a-z0-9]+$/;
    if (patrn.exec(s) && (s.length >= 6) && (s.length <= 16)) return true
    return false

}

exports.httpAddUser = function (name,callback){
    
    var status = {"status": "", "info":""};
    if (!isValid(name)){
        status.status = "fail";
        status.info = "invalid name format! 0-9 a-z 6<= name.length <=16";
        callback(status);
    }
    else{
        name_ak_db.get(name, function(err){
            if (err){
                if(err.notFound){
                    var ak = crypto.createHash('md5').update(name + generateCode(6),'utf8').digest("hex").substring(0,24);
                    var sk = crypto.createHash('md5').update(name + generateCode(6),'utf8').digest("hex");
                    console.log(name);
                    console.log(ak);
                    console.log(sk);
                    
                    async.parallel([
                        function(callback){
                            name_ak_db.put(name, ak, callback);
                        },
                        function(callback){
                            ak_sk_db.put(ak, sk, callback);
                        },
                        function(callback){
                            ak_code_db.put(ak, "null", callback);
                        }], 
                        function(err,results){
                            if(err){
                                status.status = "fail";
                                status.info = "db err!";
                                console.log(err);
                                callback(status);
                            }
                            else{
                                status.status = "success";
                                status.info = {"name":name, "ak":ak, "sk":sk};
                                console.log(results);
                                callback(status);
                            }
                        }
                    );
                }
                else{
                    status.status = "fail";
                    status.status = "Opoos! unknow error!";
                    callback(status);
                    console.log(err);
                }
            }
            else{
                status.status = "fail";
                status.status = "your name exists ,please try another one!";
                callback(status);
            }
        })
    }
}
    
    
exports.httpGetImageMthod = function (ak, code){

    ak_code_db.put(ak,code,function(err){
        if (err) console.log(err);
        ak_code_db.get(ak,function(err,value){
            console.log(value+"find!")
        });
    })
    
    ak_sk_db.get(ak,function(err,value){
    console.log("sk: " + value + err);
    })
}
    
    
exports.verify = function (ak, sk, input_code, callback){
    
    var status = {"status": ""};
    console.log("ak:"+ ak);
    ak_sk_db.get(ak,function(err,value){
        console.log(value);
        if (err){
            if ( err.notFound ){
                status.status = "your ak not exist!";
                console.log(err);
                return callback(status);
            }
            else if (err.type == "ReadError"){
                status.status = "your ak is invalid";
                console.log(err);
                return callback(status);
            }
            else {
                status.status = "Opoos! unknow error!";
                console.log(err);
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
                    if (value != input_code){
                        status.status = "input code is not right!";
                        return callback(status);
                    }
                    else {
                        status.status = "ok";
                        console.log("=sk", status);
                        return callback(status);
                    }
                });
            }
        }
    
    })
    
    
}    
    
    
    
    
    
