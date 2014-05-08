L# mirco-recaptcha  

仿Google reCAPTCHA



图像生成和处理模块

```
sudo apt-get install graphicsmagick
```


使用

```
git clone http://gitlab.widget-inc.com/kaidi.ren/mirco-recaptcha.git

cd mirco-recaptcha

npm install
```

test

```
cd mirco-recaptcha

mocha

```
# api


1.获取验证码图片

method http  get

```
http://127.0.0.1:3000/image?ak=620e0e7814c9121eef8ada56&rc=1a2b3c
```

>
|参数名|参数类型|是否必需|描述|
|---|:---|:---:|---:|
|ak|24位string|是|access key|
|rc|6位string|是|random code,用户自己随机生成，或者使用scripts/rc.js 生成|


demo

```
<head>  
<title>demo</title>
</head>
  
<body>
<img src="http://127.0.0.1:3000/image?ak=ecd302144157775dc075bded?rc=a1b2c3"/>

</body>
</html>
```


2.验证输入验证码
method http  post

```
http://127.0.0.1:3000/verify
```
|参数名|参数类型|是否必需|描述|
|---|:---|:---:|---:|
|ak|24位string|是|access key|
|sk|32位string|是|secret key|
|rc|6位string|是|random code 必须和url里的保持一致|
|input_code|6位string|是|输入的验证码值|

> 正常

```
{
"status":"ok"
}
```

> 输入错误

```
{
"status":"input code is not right!"
}
```

> sk 错误

```
{
"status":"access deny!"
}
```
> ak 错误

```
{
"status":"your ak not exist!"
}
```
> rc 错误

```
{
"status":"rc code is not right!"
}

```


```

├── app.js  运行文件
├── db      db 文件
├── demo    
│   └── demo.html demo
├── lib
│   ├── db.js   name  ak sk 相关存储和处理
│   └── recaptcha.js  逻辑部分
├── LICENSE
├── package.json
├── readme.md
├── scripts
│   ├── adduser.js  添加用户脚本
│   ├── deluser.js  删除用户脚本
│   └── rc.js       random code 生成脚本
└── test
    └── app.js      测试用例

    
```
添加用户脚本使用说明 用于获取 ak sk

```
kaidiren@upyun:~/node/gitlab/mirco-recaptcha/scripts$ node useradd.js 123456
{ status: 'success',
  info: 
   { name: '123456',
     ak: '86600096d0eda36521620d2d',
     sk: '16e9058633d323ea5a0156c43432bd2a' } }
```

```
kaidiren@upyun:~/node/gitlab/mirco-recaptcha/scripts$ node useradd.js 123456
{ status: 'fail',
  info: 'your name exists ,please try another one!',
  name: '123456',
  ak: '3c4fb05d0b6e2c5bee8ea60a',
  sk: '0c19c57e76300692dd8edabbd302d29b' }
```

 删除用户脚本使用说明

```
kaidiren@upyun:~/node/gitlab/mirco-recaptcha/scripts$ node userdel.js 123456
{ status: 'delete user 123456 success!' }
```

```
kaidiren@upyun:~/node/gitlab/mirco-recaptcha/scripts$ node userdel.js 123456
{ status: 'user not exists! can\'t del !' }

```

rc.js

```
var rc = require('./rc.js');
rc(function(res){console.log(res)});
```
```
FuKUkz  :random code

```
