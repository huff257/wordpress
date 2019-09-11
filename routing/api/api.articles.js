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
    app.post('/api/articles', (req, res) => {
        db.Article.create(req.body)
            .then(dbArticle => {
                res.json(dbArticle)
            }).catch(err => {
                res.status(404).json(err);
            }).finally(() => {

            });
    });

    // Read
    // Allows to query _id. Ex: /api/articles?_id=1234567890
    app.get('/api/articles', (req, res) => {
        const query = req.query._id ? { _id: req.query._id } : {};
        db.Article.find(query)
            .then(dbArticles => {
                res.json(dbArticles)
            }).catch(err => {
                res.status(404).json(err);
            }).finally(() => {

            });
    });

    // Update
    app.put('/api/articles/:id', (req, res) => {
        const queryId = req.params.id;
        db.Article.findByIdAndUpdate(queryId, req.body, {new: true})
            .then(dbArticle => {
                res.json(dbArticle)
            }).catch(err => {
                res.status(404).json(err);
            }).finally(() => {

            });
    });

    // Delete
    app.delete('/api/articles/:id', (req, res) => {
        const queryId = req.params.id;
        db.Article.findByIdAndDelete(queryId)
            .then(dbArticle => {
                res.json({ message: 'Succesfully deleted comment.', details: dbArticle })
            }).catch(err => {
                res.status(404).json(err);
            }).finally(() => {

            });
    });
};