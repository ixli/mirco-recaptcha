var assert = require("assert"),
    async = require("async"),
    should = require('should'),
    request = require('supertest');


var app = require("../lib/recaptcha.js"),
    db = require("../lib/db.js");


var add_user = db.addUser,
    del_user = db.deleteUser;


var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];


function generateCode(n) {
    var res = ""; 
    for(var i = 0; i < n ; i ++){
        var id = Math.ceil(Math.random()*61);
        res += chars[id];
    }
    return res;
}


describe('User test!', function(){
    it('# add user exists!', function(done){
        add_user("rkdrkd1",function(status){
            (status.info).should.have.property("more","your name exists ,please try another one!");
            status.should.have.property("status","fail");
            done();
        });
    });


    it('# add user not exist!', function(done){
        del_user("rkdrkd2",function(status){
            if (status.status.match("exists") != null || status.status.match("success") != null){
                add_user("rkdrkd2",function(status){
                    status.should.have.property("status","success");
                    done();
                });
            }
        });
    });
  
  
    it('# del exist user!', function(done){
        add_user("rkdrkd3", function(status){
            if (status.status == 'success' || status.info.name == 'rkdrkd3'){
                del_user('rkdrkd3', function(status){
                    status.should.have.property('status','success');
                    status.should.have.property('info','delete user rkdrkd3 success!');
                    done();
                });
            }
        });
    });

  
})


describe('code get and verify test', function(){
    var ak = "",
        sk = "",
        name = "rkdrkd4",
        rc = "1a2b3c",
        code = generateCode(6);

    it("# code get ", function(done){
        add_user(name,function(status){
           if (status.status == 'success' || status.info.name == name){
                ak = status.info.ak;
                sk = status.info.sk;
               request(app)
               .get('/image?ak='+ ak + "&ac=" + rc)
               .expect(200)
               .end(function(err,res){
                    if(err) return done(err);
                    done();
                });
           };     
        });
    });

    it("# code verify with right input_code", function(done){
        db.getImageMthod(ak, rc, code);
        request(app)
        .post('/verify')
        .set('Accept', 'application/json')
        .send({ ak: ak, sk: sk, rc: rc, input_code: code })
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            done();
            res.body.should.have.property('status','success');
        });
    });

    it("# code verify with wrong input_code", function(done){
        db.getImageMthod(ak, rc, code);
        request(app)
        .post('/verify')
        .set('Accept', 'application/json')
        .send({ ak: ak, sk: sk, rc: rc, input_code: code.substring(3,6)+code.substring(0,3)})
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            done();
            res.body.should.have.property('info','input code is not right!');
        });
    });
    
    
    it("# code verify with not exist ak", function(done){
        db.getImageMthod(ak, rc, code);
        request(app)
        .post('/verify')
        .set('Accept', 'application/json')
        .send({ ak: ak.substring(12,24)+ak.substring(0,12), sk: sk, rc: rc, input_code: code})
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            done();
            res.body.should.have.property('info','your ak not exist!');
        });
    });
    
    it("# code verify with invalid ak", function(done){
        db.getImageMthod(ak, rc, code);
        request(app)
        .post('/verify')
        .set('Accept', 'application/json')
        .send({ ak: "", sk: sk, rc: rc, input_code: code})
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            done();
            res.body.should.have.property('info','your ak is invalid!');
        });
    });
    
    it("# code verify with wrong sk", function(done){
        db.getImageMthod(ak, rc, code);
        request(app)
        .post('/verify')
        .set('Accept', 'application/json')
        .send({ ak: ak, sk: sk.substring(16,32)+sk.substring(0,16), rc: rc, input_code: code})
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            done();
            res.body.should.have.property('info','ak and sk are not matching! access deny!');
        });
    });    
    
    
    it("# code verify with wrong rc", function(done){
        db.getImageMthod(ak, rc, code);
        request(app)
        .post('/verify')
        .set('Accept', 'application/json')
        .send({ ak: ak, sk: sk, rc: rc.substring(3,6)+rc.substring(0,3), input_code: code})
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            done();
            res.body.should.have.property('info','rc code is not right!');
        });
    });
    
});
