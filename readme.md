# mirco-recaptcha  

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


web 框架

```
npm install -g express
```

```
npm install
```


###demo

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  
<title>code</title>
<script type="text/javascript" src="http://127.0.0.1:3000/recaptcha.js"></script>
<script type="text/javascript">
window.onload=function(){

    document.getElementById('btn').onclick = function(){   
        var obj = document.getElementById("code_div");
         check.get(function(url){
         (function(){
              document.getElementById("code").src = url; return false;
       })();   
       }) 
        if(obj.style.display == "block"){
                            
            obj.style.display = "none";
  
        }else{
                                    
            obj.style.display = "block";
        }  
           return false;      
        }         
    }

function code_check(input_code){
       check.verify(input_code, function(json){
         alert(json.status);
       })
}


</script>
</head>
  
<body>
 <div id="code_div" style="display:none;">    
<img id="code" src="none"/>
<input id="input_code" type="text" />
<input type="button" value="check" onclick='code_check(document.getElementById("input_code").value)' >
</div>
<input id="btn" type="button" value="click" />

</body>
</html>

```





###api
> check.get(callback)

> check.verify(input_code,callback)

