// Require all models
const db = require('../../models');

module.exports = app => {

    // Read
    // Allows to query _id. Ex: /api/articles?_id=1234567890
    app.get('/api/scraped/articles', (req, res) => {
        const query = req.query._id ? { _id: req.query._id } : {};
        db.ScrapedArticle.find(query)
            .then(dbScrapedArticles => {
                res.json(dbScrapedArticles)
            }).catch(err => {
                res.status(400).json(err);
            }).finally(() => {

            });
    });

};