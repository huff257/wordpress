// Dependencies
const axios = require('axios');
const cheerio = require('cheerio');
const path = require("path");
const mongoose = require('mongoose');
// Require all models
const db = require('../models');

// Document variables
const baseUrl = 'https://www.smashingmagazine.com';
const scrapeUrl = baseUrl + '/articles';

module.exports = app => {
    app.get('/api', (req, res) => {
        res.json({ message: "Got it!" });
    });

    // Manual article posting
    app.post('/articles', (req, res) => {
        db.Article.create(req.body)
            .then(dbArticle => {
                res.json(dbArticle);
            }).catch(err => {
                res.status(400).json(err);
            }).finally(() => {

            });
    });

    // Remove an article by its _id
    app.post('/articles/:id', (req, res) => {
        const queryId = req.params.id;
        db.Article.findByIdAndDelete(queryId)
            .then(dbArticle => {
                res.json({message: 'Successfully deleted ' + queryId});
            }).catch(err => {
                res.status(400).json(err);
            }).finally(() => {

            });
    });

    // Get all articles
    app.get('/articles', (req, res) => {
        db.Article.find()
            .then(dbArticle => {
                res.json(dbArticle);
            }).catch(err => {
                res.status(400).json(err);
            }).finally(() => {

            });
    });

    // Get all comments
    app.get('/api/comments', (req, res) => {
        db.Comment.find()
            .then(dbComments => {
                res.json(dbComments)
            }).catch(err => {
                res.status(400).json(err);
            }).finally(() => {
                console.log('GET all comments.');
            });
    });
    
    // Post a new comment
    app.post('/api/comments', (req, res) => {
        db.Comment.create(req.body)
            .then(dbComment => {
                res.json(dbComment)
            }).catch(err => {
                res.status(400).json(err);
            }).finally(() => {
                console.log('Comment posted.');
            });
    });
    
    // Remove an existing comment
    app.post('/api/comments/:id', (req, res) => {
        const queryId = req.params.id;
        db.Comment.findByIdAndDelete(queryId)
            .then(dbComment => {
                res.json({message: 'Succesfully deleted comment', details: dbComment})
            }).catch(err => {
                res.status(400).json(err);
            }).finally(() => {
                console.log('Comment removed.');
            });
    });

    // Scrapes the website and adds the articles to the database
    app.get('/scrape', (req, res) => {
        axios.get(scrapeUrl)
            .then(response => {
                // Hanndle the response
                const data = [];
                let count = 0;
                // Loads the url HTML into cheerio
                const $ = cheerio.load(response.data);
                $('article.article--post').each((index, article) => {
                    count ++;
                    const title = $(article).children('h1.article--post__title').children('a').text();
                    const link = baseUrl + $(article).children('h1.article--post__title').children('a').attr('href');

                    data.push({
                        title: title,
                        link: link
                    });
                });

                // Post the array to the database
                db.Article.create(data)
                    .then(dbArticle => {
                        res.json({
                            message: 'Scraped ' + scrapeUrl,
                            count: count,
                            data: data
                        });
                    }).catch(err => {
                        // Handle the error
                        res.status(400).json(err);
                    }).finally(() => {
                        // Always runs
                        console.log("Someone made a scrape attempt at " + Date.now());
                    });
            });
    });
};