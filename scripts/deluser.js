var userdel = require('../lib/db.js').deleteUser;

userdel(process.argv[2], function(status){
    console.log(status);
    })
