// Dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

// Activate chai methods
const assert = require('chai').assert;
const should = require('chai').should();
chai.use(chaiHttp);

// Create the base url
const baseUrl = {
    articles: '/api/articles',
    comments: '/api/comments'
}

// ----------------------- Comments CRUD ----------------------- //

// Flags the response from posting a new comment
// to get the ID for removing the comment
let dummyComment;

// Function for making a dummy comment
const createDummyComment = function (bodyParameter) {
    return { body: bodyParameter }
};

describe('Comments CRUD', () => {
    // Create
    it(`Create - it should POST a comment to ${baseUrl.comments}.`, done => {
        chai.request(server)
            .post(baseUrl.comments)
            .send(createDummyComment('Here is a dummy comment.'))
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('object');

                dummyComment = res.body;

                done();
            });
    });

    // Read
    it(`Read - it should GET all comments from ${baseUrl.comments}.`, done => {
        chai.request(server)
            .get(baseUrl.comments)
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('array');

                done();
            });
    });

    // Read
    // Specified by an id 
    it(`Read - it should GET a specific comment from ${baseUrl.comments}?_id=.`, done => {
        chai.request(server)
            .get(baseUrl.comments + '?_id=' + dummyComment._id)
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('array');

                done();
            });
    });

    // Update
    it(`Update - it should PUT a specific comment from ${baseUrl.comments}/:id.`, done => {
        const updateBody = 'Here is the test update comment text.'
        chai.request(server)
            .put(baseUrl.comments + '/' + dummyComment._id)
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
    it(`Delete - it should DELETE a specific comment from ${baseUrl.comments}/:id.`, done => {
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
});

// ----------------------- End Comments CRUD ----------------------- //

// ----------------------- Articles CRUD ----------------------- //

// Flags the response from posting a new comment
// to get the ID for removing the comment
let dummyArticle;

// Can you directly use the model to make these?
const createDummyArticle = function (titleParameter, linkParameter) {
    return { title: titleParameter, link: linkParameter }
};

describe('Articles CRUD', () => {
    // Create
    it(`Create - it should POST an article to ${baseUrl.articles}.`, done => {
        chai.request(server)
            .post(baseUrl.articles)
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
    it(`Read - it should GET all articles from ${baseUrl.articles}.`, done => {
        chai.request(server)
            .get(baseUrl.articles)
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
    it(`Read - it should GET a specific article from ${baseUrl.articles}?_id=.`, done => {
        chai.request(server)
            .get(baseUrl.articles + '?_id=' + dummyArticle._id)
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
    it(`Update - it should PUT a specific article from ${baseUrl.articles}/:id.`, done => {
        const updateTitle = 'Here is the test update article title text...';
        const updateLink = 'https://www.test-article-link.com/updated';
        chai.request(server)
            .put(baseUrl.articles + '/' + dummyArticle._id)
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
    it(`Delete - it should DELETE a specific article from ${baseUrl.articles}/:id.`, done => {
        chai.request(server)
            .delete(baseUrl.articles + '/' + dummyArticle._id)
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

// ----------------------- End Articles CRUD ----------------------- //