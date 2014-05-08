var crypto = require('crypto');

var async = require('async'),
    levelup = require('levelup');

var name_db = levelup(__dirname + '/../db/name_db'),     // from name find {ak:""; sk:""};
    ak_db = levelup(__dirname + '/../db/ak_db'),     // from ak find sk name {name:"",sk:""};
    ak_rc_db = levelup(__dirname + '/../db/ak_rc_db/'); // ak/rc   -> {ak:"" ,sk: "",rc:"",code:""};

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

exports.addUser = function (name,callback){
    
    var status = {"status": "", "info":""};
    if (!isValid(name)){
        status.status = "fail";
        status.info = "invalid name format! 0-9 a-z 6<= name.length <=16";
        callback(status);
    }
    else{
        name_db.get(name, function(err, value){
            if (err){
                if(err.notFound){
                    var ak = crypto.createHash('md5').update(name + generateCode(6),'utf8').digest("hex").substring(0,24);
                    var sk = crypto.createHash('md5').update(name + generateCode(6),'utf8').digest("hex");
                    
                    async.parallel([
                        function(callback){
                            name_db.put(name, JSON.stringify({"ak":ak,"sk":sk}), callback);
                        },
                        function(callback){
                            ak_db.put(ak, JSON.stringify({"name":name,"sk":sk}), callback);
                        }
                    ],  function(err,results){
                            if(err){
                                status.status = "fail";
                                status.info = "db err!";
                                callback(status);
                            }
                            else{
                                status.status = "success";
                                status.info = {"name":name, "ak":ak, "sk":sk};
                                callback(status);
                            }
                        }
                    );
                }
                else{
                    status.status = "fail";
                    status.info = "Opoos! unknow error!";
                    callback(status);
                }
            }
            else{
                status.status = "fail";
                status.info = {"more": "your name exists ,please try another one!",
                                "name": name,
                                "ak": JSON.parse(value).ak,
                                "sk": JSON.parse(value).sk
                              };
                callback(status);

            }
        })
    }
}
    
exports.deleteUser = function(name,callback){
    var status = {"status":""};
    name_db.get(name, function(err, value){
        if (err){
            if(err.notFound){
                status.status = "user not exists! can't del !";
                return callback(status);
            }
            else{
                console.log(err);
                status.status = err.toString();
                return callback(status);
            }
        }
        else{
            async.parallel([
                function(callback){
                    name_db.del(name, callback);
                },
                function(callback){
                    ak_db.del(JSON.parse(value).ak, callback);
                }
            ], function(err,results){
                   if(err){
                       console.log(err);
                       status.status = err.toString();
                       return callback(status);
                   }
                   else{
                   status.status = "delete user " + name + " success!";
                   return callback(status);
                   }
               }
            )
        }
    });  
}


exports.getImageMthod = function (ak, rc, code){

    ak_rc_db.put(ak+"/"+rc, code, function(err){
        if (err) console.log(err);
    });
    //console.log(ak, rc, code,ak+"/"+rc);
}
    
    
exports.verify = function (ak, sk, rc, input_code, callback){
    
    var status = {"status": ""};
    ak_db.get(ak,function(err,value){
        if (err){
            if ( err.notFound ){
                status.status = "your ak not exist!";
                return callback(status);
            }
            else if (err.type == "ReadError"){
                status.status = "your ak is invalid!";
                return callback(status);
            }
            else {
                status.status = "Opoos! unknow error!";
                console.log(err);
                return callback(status);
                }
        }
        else{
            if (JSON.parse(value).sk != sk){
                status.status = "ak and sk are not matching! access deny!";
                return callback(status);
            }
            else{
                ak_rc_db.get(ak+"/"+rc, function(err, value){
                    if(err){
                        if(err.notFound || err.type == "ReadError"){
                            status.status = "rc code is not right!";
                            return callback(status);
                        }
                        else{
                            status.status = "Opoos! unknow error!";
                            console.log(err);
                            return callback(status);
                        }
                    }
                    else{
                        if (value != input_code){
                            status.status = "input code is not right!";
                            return callback(status);
                        }
                        else {
                            status.status = "ok";
                            return callback(status);
                        }
                    }
                });
            }
        }
    
    })
}    



exports.name_db = name_db;
exports.ak_db = ak_db;
exports.ak_rc_db = ak_rc_db;

