var assert = require("assert"),
    should = require('should'),
    request = require('supertest');


var app = require("../lib/recaptcha.js");



describe('GET /user add', function(){
  it('respond with json', function(done){
    request(app)
      .get('/user/add?name=rkdrkd')
      .set('Accept', 'application/json')
      .expect(200, done);
  })
})



describe('GET /user add', function(){
  it('respond with json', function(done){
    request(app)
      .get('/user/add?name=rkdrkd8')
      .set('Accept', 'application/json')
      .expect(200, done);
  })
})




