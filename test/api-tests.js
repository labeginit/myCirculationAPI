const request = require('supertest');
const app = require('express');
const Record = require('../models/record');
const User = require('../models/user');
const { assert } = require('chai');
/*
describe('POST request to /register', function () {
    it('response should contain an object and status code 200', function (done) {
        this.timeout(5000);
        const response = request(app).post('/register').send(
            new User({
                email: 'lili@gmail.com',
                firstName: 'NewUser',
                lastName: 'Surname',
                birthDate: '2000-07-06',
                password: 'password'
            })).expect(200, done);

        assert(response._data._doc.email == 'lili@gmail.com');
        done();
    });
});

describe('POST request to /login', function () {
    it('response should contain an object and status code 200', function (done) {
        this.timeout(5000);
        const response = request(app).post('/login').send(
            {
                email: 'lili@gmail.com',
                password: 'password'
            }).expect(200, done);
        done();
    });
});*/


