var assert = require("assert"),
    async = require("async"),
    should = require('should'),
    request = require('supertest');


var app = require("../lib/recaptcha.js"),
    db = require("../lib/db.js");


describe('add exists user test!', function(){
  it('error!', function(done){
    request(app)
      .get('/user/add?name=rkdrkd')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done()
        res.body.should.have.property('info','your name exists ,please try another one!');
        res.body.should.have.property('status','fail');    
       })
  })
})


describe('add new user test!', function(){
    it('error!', function(done){
        db.name_ak_db.get("rkdrkd8", function(err, value){
            if(typeof(value) != 'undefine'){
                db.ak_sk_db.del(value, function(err){
                    if (err) return console.log(err);
                });
                db.ak_code_db.del(value, function(err){
                    if (err) return console.log(err);
                });
            }
        })
        db.name_ak_db.del("rkdrkd8",function(err){
            if (err) return console.log(err);
        });
        request(app)
        .get('/user/add?name=rkdrkd8')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            done();
            res.body.should.have.property('status','success'); 
        })
    })
})


describe('code get and verify test', function(){
    it('error!', function(done){
        db.name_ak_db.get("testuser", function(err, value){
            if(typeof(value) != 'undefine'){
                db.ak_sk_db.del(value, function(err){
                    if (err) return console.log(err);
                });
                db.ak_code_db.del(value, function(err){
                    if (err) return console.log(err);
                });
            }
        })
        db.name_ak_db.del("testuser",function(err){
            if (err) return console.log(err);
            });
        request(app)
        .get('/user/add?name=testuser')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            done()
            res.body.should.have.property('status','success'); 
            var code = "123abc",
                ak = res.body.info.ak,
                sk = res.body.info.sk;
            db.httpGetImageMthod(ak , code);
            describe('code verify with right code test', function(){
                it('error!', function(done){
                    request(app)
                    .post('/verify')
                    .set('Accept', 'application/json')
                    .send({ ak: ak, sk: sk, input_code: code })
                    .expect(200)
                    .end(function(err, res){
                        if (err) return done(err);
                        done();
                        res.body.should.have.property('status','ok');
                    })
                })
            })
            
            describe('code verify with wrong code test', function(){
                it('error!', function(done){
                    request(app)
                    .post('/verify')
                    .set('Accept', 'application/json')
                    .send({ ak: ak, sk: sk, input_code: "125abc" })
                    .expect(200)
                    .end(function(err, res){
                        if (err) return done(err);
                        done();
                        res.body.should.have.property('status','input code is not right!');
                    })
                })
            })
            
            describe('code verify with wrong ak test 1', function(){
                it('error!', function(done){
                    request(app)
                    .post('/verify')
                    .set('Accept', 'application/json')
                    .send({ ak: ak.substring(12,24)+ak.substring(0,12), sk: sk, input_code: code })
                    .expect(200)
                    .end(function(err, res){
                        if (err) return done(err);
                        done();
                        res.body.should.have.property('status','your ak not exist!');
                    })
                })
            })
            
            describe('code verify with wrong ak test 2', function(){
                it('error!', function(done){
                    request(app)
                    .post('/verify')
                    .set('Accept', 'application/json')
                    .send({ ak: "", sk: sk, input_code: code })
                    .expect(200)
                    .end(function(err, res){
                        if (err) return done(err);
                        done();
                        res.body.should.have.property('status','your ak is invalid!');
                    })
                })
            })
            
            describe('code verify with wrong sk test', function(){
                it('error!', function(done){
                    request(app)
                    .post('/verify')
                    .set('Accept', 'application/json')
                    .send({ ak: ak, sk: sk.substring(16,32)+sk.substring(0,16), input_code: code })
                    .expect(200)
                    .end(function(err, res){
                        if (err) return done(err);
                        done();
                        res.body.should.have.property('status','ak and sk are not matching! access deny!');
                    })
                })
            })
            
        })
    })
})


