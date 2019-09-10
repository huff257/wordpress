const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');
const assert = require('chai').assert;
const should = require('chai').should();

chai.use(chaiHttp);

describe('API Route tests for articles', () => {
    it('it should get back a simple json message when visiting /api', done => {
        chai.request(server)
            .get('/api')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
            
                done();
            });
    });
});