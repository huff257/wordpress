// Dependencies
const axios = require('axios');
const cheerio = require('cheerio');
const path = require("path");
const mongoose = require('mongoose');
// Require all models
const db = require('../models');

// Document variables
const baseUrl = 'https://www.smashingmagazine.com';
const scrapeUrl = 'https://www.smashingmagazine.com/articles';

module.exports = app => {
    app.get('/api', (req, res) => {
        res.json({ message: "Got it!" });
    });

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