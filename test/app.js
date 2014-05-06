var assert = require("assert"),
    async = require("async"),
    should = require('should'),
    request = require('supertest');


var app = require("../lib/recaptcha.js"),
    db = require("../lib/db.js");


describe('GET /user add 1', function(){
  it('user exist!', function(done){
    request(app)
      .get('/user/add?name=rkdrkd')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done()
        res.body.should.have.property('status','your name exists ,please try another one!');    
       })
  })
})







describe('GET /user add 2', function(){
    it('respond with json', function(done){
        db.name_ak_db.get("rkdrkd8", function(err, value){
            if(typeof(value) != 'undefine'){
                db.ak_sk_db.del(value, function(){});
                db.ak_code_db.del(value, function(){});
            }
        })
        db.name_ak_db.del("rkdrkd8",function(){});
        request(app)
        .get('/user/add?name=rkdrkd8')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            done()
            res.body.should.have.property('status','success');    
        })
    })
})


