var http = require('http');
var fs = require('fs');



http.createServer(function (req, res){
  var rs = fs.createReadStream('../lib/recaptcha.js');
  var data = '';

  rs.on("data", function(trunk){
  data += trunk;
});

rs.on("end", function(){
res.end(data);
});
}).listen(8001)
