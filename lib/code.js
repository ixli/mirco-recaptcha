var crypto = require('crypto'),
	fs = require('fs'),
   	gm = require('gm');


var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];


function GenerateCode(n) {
     
	 var res = ""; 
     for(var i = 0; i < n ; i ++) {
         var id = Math.ceil(Math.random()*61);
         res += chars[id];
     }
     return res;
}




exports.GetImage = function(callback){
	//验证码
	var code = GenerateCode(6);
	var name =  crypto.createHash('md5').update(code, 'utf8').digest("hex").substring(0,8);

	//生成图片部分
	var ImageMagick = gm.subClass({ imageMagick: true });
	ImageMagick(80, 20, "#ddff99f3")
	.drawText(16, 15, code)
	.write("./img/1/"+name+".png", function (err) {
		if(err){
	 		console.log(err);
		}
});


//生成验证码的信息
var result =  {
    "domain": "http://127.0.0.1:3000",
    "code": code,
    "name": name,
    "url":"/img/1/"+name+".png"};
    
callback(null, result);

}






