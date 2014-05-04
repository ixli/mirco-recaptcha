name_ak_db.get("rkd",function(err,value){
    console.log(value);
    ak_code_db.get(value,function(err,value){console.log(value)});
    ak_sk_db.get(value,function(err,value){
    console.log(value);
    })
})





