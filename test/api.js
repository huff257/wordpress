// Dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

// Activate chai methods
const assert = require('chai').assert;
const should = require('chai').should();
chai.use(chaiHttp);

const createDummyArticle = function (titleParameter, linkParameter) {
    return { title: titleParameter, link: linkParameter }
};

describe('Articles: API Get Routes', () => {
    it('When GET /api, get back JSON, which is an object that includes a message', done => {
        chai.request(server)
            .get('/api')
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');

                done();
            });
    });

    // it('When visiting "/scrape", it should get back JSON of scraped articles, including message, count, and data', done => {
    //     chai.request(server)
    //         .get('/scrape')
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             res.body.should.be.a('object');
    //             res.body.should.have.property('message');
    //             res.body.should.have.property('count');
    //             res.body.should.have.property('data');

    //             done();
    //         });
    // });
});

// Flags the response from posting a new article
// to get the ID for removing the article
let dummyArticle;

describe("Articles: API Post Routes", () => {
    it('When POST /articles, creates a new article in the database', done => {
        const article = createDummyArticle('Test title name', 'https://www.smashingmagazine.com/test-article/');
        chai.request(server)
            .post('/articles')
            .send(article)
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                dummyArticle = res.body;

                done();
            });
    });

    it('When POST /articles/:id, it should remove the article specified by the id', done => {
        chai.request(server)
            .post('/articles/' + dummyArticle._id)
            .end((err, res) => {
                if (err) return console.log(err)
                res.should.have.status(200);

                done();
            });
    });

    it('When POST /articles with a bad link, it should get back error JSON', done => {
        const article = createDummyArticle('Test title name', 'bad-link');
        chai.request(server)
            .post('/articles')
            .send(article)
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(400);

                done();
            });
    });

    it('When POST /articles with a bad title, it should get back error JSON', done => {
        const article = createDummyArticle('', 'https://www.smashingmagazine.com/2019/09/webflow-the-future-of-web-development/');
        chai.request(server)
            .post('/articles')
            .send(article)
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(400);

                done();
            });
    });
});

const createDummyComment = function (bodyParameter) {
    return { body: bodyParameter }
};

describe('Comments: API GET Routes', () => {
    it('When GET /api/comments, it should get back a JSON array', done => {
        chai.request(server)
            .get('/api/comments')
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('array');

                done();
            });
    });
});

// Flags the response from posting a new comment
// to get the ID for removing the comment
let dummyComment; 

describe('Comments: API POST Routes', () => {
    it('When POST /api/comments (with valid req.body) it should res with status 200', done => {
        const comment = createDummyComment('Here is a dummy comment.');
        chai.request(server)
            .post('/api/comments')
            .send(comment)
            .end((err, res) => {
                if (err) return console.log(err);
                dummyComment = res.body;
                res.should.have.status(200);

                done();
            });
    });

    it('When POST /api/comments/:id (with valid id) it should remove the comment specified in the req.params.id', done => {
        chai.request(server)
            .post('/api/comments/' + dummyComment._id)
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);

                done();
            });
    });
});