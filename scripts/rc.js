var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];


var rc = function (callback) {
    var res = ""; 
    for(var i = 0; i < 6 ; i ++){
        var id = Math.ceil(Math.random()*61);
        res += chars[id];
    }
    callback(res);
}

module.exports = rc ;
