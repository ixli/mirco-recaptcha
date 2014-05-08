var useradd = require('../lib/db.js').addUser;

useradd(process.argv[2],function(status){
    console.log(status);
})

