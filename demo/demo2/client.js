var http = require('http');


var options = {
    host : '127.0.0.1',
    port: 3000,
    path: '/',
    method: 'GET'
};

var req =  http.request(options, function(res){
    //console.log('STATUS:' + res.statusCode);
    //console.log('HEADER:' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function(data){
        
        //do something with data
        console.log(JSON.parse(data));
    });
})

req.end();   

