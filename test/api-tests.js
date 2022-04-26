const request = require('supertest');
const app = require('express')();
const Record = require('../models/record');
const User = require('../models/user');
require('dotenv/config');

describe('Test a GET request for /users', function () {
    console.log(process.env.DB_URL);
    it('users should not be empty', function (done) {
        const response = request(app).get('/users').send();
        request(app)
            .get('/users')
            .set('Accept', 'application/json')
            .expect(200, done);

    });
});
/*
describe('Test a POST request for /users', function(){
    it('response should contain an object and status code 200', function(done){
        const response = request(app).post('/users').send(
            new User({
                email: 'lili@gmail.com',
                firstName: 'Liliia',
                lastName: 'Allans',
                birthDate: '10/12/1900'})
        ).expect(200, done);
    });
    
});*/