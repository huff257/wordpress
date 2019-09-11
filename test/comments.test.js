// Dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

// Activate chai methods
const assert = require('chai').assert;
const should = require('chai').should();
chai.use(chaiHttp);

// Create the base url
const baseUrl = '/api/comments';

// Flags the response from posting a new comment
// to get the ID for removing the comment
let dummyComment;

// Function for making a dummy comment
const createDummyComment = function (bodyParameter, articleIdParameter = '5d796bc944dc5b4480b1f34e') {
    return { body: bodyParameter, article: articleIdParameter }
};

describe('Comments CRUD', () => {

    // Create
    it(`Create - it should POST a comment to ${baseUrl}.`, done => {
        chai.request(server)
            .post(baseUrl)
            .send(createDummyComment('Here is a dummy comment.'))
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('object');

                dummyComment = res.body.dbComment;

                done();
            });
    });

    // Read
    it(`Read - it should GET all comments from ${baseUrl}.`, done => {
        chai.request(server)
            .get(baseUrl)
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('array');

                done();
            });
    });

    // Read
    // Specified by an id 
    it(`Read - it should GET a specific comment from ${baseUrl} using ?_id.`, done => {
        chai.request(server)
            .get(baseUrl + '?_id=' + dummyComment._id)
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.have.property('article');

                done();
            });
    });

    // Update
    it(`Update - it should PUT a specific comment from ${baseUrl} using ?_id.`, done => {
        const updateBody = 'Here is the test update comment text.';
        chai.request(server)
            .put(baseUrl + '/' + dummyComment._id)
            .send(createDummyComment(updateBody))
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('body').with.equal(updateBody);

                done();
            });
    });

    // Delete
    it(`Delete - it should DELETE a specific comment from ${baseUrl}/:id.`, done => {
        chai.request(server)
            .delete('/api/comments/' + dummyComment._id)
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('details');

                done();
            });
    });

    // Delete all
    it(`Delete - it should DELETE all comments from ${baseUrl}.`, done => {
        chai.request(server)
            .delete(baseUrl)
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('details');

                done();
            });
    });
});