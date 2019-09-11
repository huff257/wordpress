// Dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

// Activate chai methods
const assert = require('chai').assert;
const should = require('chai').should();
chai.use(chaiHttp);

const createDummyArticle = function(titleParameter, linkParameter) { 
    return {title: titleParameter, link: linkParameter} 
};

describe('API Route tests for articles', () => {
    it('When visiting "/api", it should get back JSON, which is an object that includes a message', done => {
        chai.request(server)
            .get('/api')
            .end((err, res) => {
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

    it('When posting an article to "/articles", it should get back error JSON of when sending a bad url', done => {
        const article = createDummyArticle('Test title name', 'bad-link');
        chai.request(server)
            .post('/articles')
            .send(article)
            .end((err, res) => {
                res.should.have.status(400);
            
                done();
            });
    });

    it('When posting an article to "/articles", it should get back error JSON of when sending a blank title', done => {
        const article = createDummyArticle('', 'https://www.smashingmagazine.com/2019/09/webflow-the-future-of-web-development/');
        chai.request(server)
            .post('/articles')
            .send(article)
            .end((err, res) => {
                res.should.have.status(400);
            
                done();
            });
    });
});

let dummyArticle; 

describe("Api Route for adding and removing articles", () => {
    it('When posting to /articles with valid json, creates a new article in the database', done => {
        const article = createDummyArticle('Test title name', 'https://www.smashingmagazine.com/test-article/');
        chai.request(server)
            .post('/articles')
            .send(article)
            .end((err, res) => {
                if (err) return console.log(err);
                res.should.have.status(200);
                dummyArticle = res;

                done();
            });
    });

    it('When posting to /articles/:id, removes the article specified by the id', done => {
        chai.request(server)
            .post('/articles/' + dummyArticle.body._id)
            .end((err, res) => {
                if (err) return console.log(err)
                res.should.have.status(200);
            
                done();
            });
    });
})