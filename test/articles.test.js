// Dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

// Activate chai methods
const assert = require('chai').assert;
const should = require('chai').should();
chai.use(chaiHttp);

// Create the base url
const baseUrl = '/api/articles';

// Flags the response from posting a new comment
// to get the ID for removing the comment
let dummyArticle;

// Can you directly use the model to make these?
const createDummyArticle = function (titleParameter, linkParameter) {
    return { title: titleParameter, link: linkParameter }
};

describe('Articles CRUD', () => {
    // Create
    it(`Create - it should POST an article to ${baseUrl}.`, done => {
        chai.request(server)
            .post(baseUrl)
            .send(createDummyArticle('Here is a dummy article title.', 'https://www.test-article-link.com/'))
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('object');

                dummyArticle = res.body;

                done();
            });
    });

    // Read
    it(`Read - it should GET all articles from ${baseUrl}.`, done => {
        chai.request(server)
            .get(baseUrl)
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');

                done();
            });
    });

    // Read
    // Specified by an id 
    it(`Read - it should GET a specific article from ${baseUrl}?_id=.`, done => {
        chai.request(server)
            .get(baseUrl + '?_id=' + dummyArticle._id)
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body.should.have.lengthOf(1);

                done();
            });
    });

    // Update
    it(`Update - it should PUT a specific article from ${baseUrl}/:id.`, done => {
        const updateTitle = 'Here is the test update article title text...';
        const updateLink = 'https://www.test-article-link.com/updated';
        chai.request(server)
            .put(baseUrl + '/' + dummyArticle._id)
            .send(createDummyArticle(updateTitle, updateLink))
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('link');

                done();
            });
    });

    // Delete
    it(`Delete - it should DELETE a specific article from ${baseUrl}/:id.`, done => {
        chai.request(server)
            .delete(baseUrl + '/' + dummyArticle._id)
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