var useradd = require('../lib/db.js').httpAddUser;

useradd(process.argv[2],function(status){
    console.log(status);
})

