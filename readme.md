# recaptcha server  

仿Google reCAPTCHA

### 依赖

图像生成和处理模块
```
sudo apt-get install graphicsmagick
```
or
```
sudo apt-get install imagemagick
```
对应的node.js绑定
```
npm install gm
```
leveldb 依赖
```
npm install levelup leveldown
```
or
```
npm install level
```

web 框架
```
npm install -g express
```


### 请求服务

### 用户demon1
```
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 
	<script language="javascript" type="text/javascript" src="jquery-1.11.0.min.js"></script>
</head>
<body>
	<img id="code" src="none" />
  code: <input type="text" id="input_code" />
<button onclick="check()">验证</button>
 
 
<script type="text/javascript">
var code = "";
$.ajax({
	type : "get",
	async: false,
	url : "http://127.0.0.1:3000",
	dataType : "json",
	success : function(json){
		(function(){
			document.getElementById("code").src = json.domain+json.url;
			code = json.code;
		})();
	},
	error:function(){
		alert('fail');
	}
});

function check(){
	if (document.getElementById("input_code").value == code){
		alert("ok");
	}
else  alert("fail!");
}
</script>
</body>
</html>

```
>示例需要使用jquery

>示例的逻辑很简单，处于安全考虑请不要这么写。

>推荐方式，因为图片url和验证码，和随机码都会通过json传递过来，最好统一在后台获取，只在前端呈现出来图片，验证请在后端验证。



### 用户demon2
```
var http = require('http');


var options = {
    host : '127.0.0.1',
    port: 3000,
    path: '/',
    method: 'GET'
};

var req = http.request(options, function(res){
    //console.log('STATUS:' + res.statusCode);
    //console.log('HEADER:' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function(data){
        
        //do something with data
        console.log(JSON.parse(data));
    });
})

req.end();


```

JSON.parse(data) 的内容会如下:

```
{ domain: 'http://127.0.0.1:3000',
  code: 'm1bR1A',
  name: 'fa8fe2e4',
  rcode: 'KGOc',
  url: '/img/1/fa8fe2e4.jpg' }

```
domain+url便可以直接访问该图片
等用户input后，再去和code校验

### 服务demon

```
server
```

### 模块核心
#### code模块
>提供验证码的生成
 
>>同时生成6位的验证码和4位的随机码和验证码图片

#### db模块 

#### server模块
>把生成的验证数据，提供成http服务的样式

> 返回数据形式
  
``` 
   {
    "domain":"http://127.0.0.1:3000",
    "code":"zhHWaA",
    "name":"6c549762",
    "rcode":"Dab2",
    "url":"/img/1/6c549762.jpg"
    }
```

   >domian 为服务url
   
   >code 为验证码
   
   >name 为图片的名字
   
   >rcode 为随机码，方便混乱加密验证使用

#### api

>app.js

>>  1.get请求 

>>   把数据发给用户，让用户自行验证

## License


###流程变更
获取流程。
http://www.google.com/get?ak=ak
ak
sk

确认流程
http://www.google.com/verify?ak=ak


##备注：