// Dependencies
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const mongoose = require('mongoose');
// Require all models
const db = require('../../models');

// Document variables
const baseUrl = 'https://www.smashingmagazine.com';
const scrapeUrl = baseUrl + '/articles';

module.exports = app => {

    // Create
    app.post('/api/comments', (req, res) => {
        db.Comment.create(req.body)
            .then(dbComment => {
                res.json(dbComment)
            }).catch(err => {
                res.status(404).json(err);
            }).finally(() => {

            });
    });

    // Read
    // Allows to query _id. Ex: /api/comments?_id=1234567890
    app.get('/api/comments', (req, res) => {
        const query = req.query._id ? { _id: req.query._id } : {};
        db.Comment.find(query)
            .populate('article')
            .then(dbComments => {
                res.json(dbComments)
            }).catch(err => {
                res.status(404).json(err);
            }).finally(() => {

            });
    });

    // Update
    app.put('/api/comments/:id', (req, res) => {
        const queryId = req.params.id;
        db.Comment.findByIdAndUpdate(queryId, req.body, {new: true})
            .then(dbComment => {
                res.json(dbComment)
            }).catch(err => {
                res.status(404).json(err);
            }).finally(() => {

            });
    });

    // Delete
    app.delete('/api/comments/:id', (req, res) => {
        const queryId = req.params.id;
        db.Comment.findByIdAndDelete(queryId)
            .then(dbComment => {
                res.json({ message: 'Succesfully deleted comment', details: dbComment })
            }).catch(err => {
                res.status(404).json(err);
            }).finally(() => {

            });
    });

    // ----------------------- End Comments CRUD ----------------------- //

    // ----------------------- Scraping ----------------------- //

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
                    count++;
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
                        res.status(404).json(err);
                    }).finally(() => {
                        // Always runs
                        console.log("Someone made a scrape attempt at " + Date.now());
                    });
            });
    });
};