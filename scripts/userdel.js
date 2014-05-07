var userdel = require('../lib/db.js').httpDeleteUser;

userdel(process.argv[2], function(status){
    console.log(status);
    })
