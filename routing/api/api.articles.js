// Require all models
const db = require('../../models');

module.exports = app => {

    // Create
    app.post('/api/articles', (req, res) => {
        db.Article.create(req.body)
            .then(dbArticle => {
                res.json(dbArticle)
            }).catch(err => {
                res.status(400).json(err);
            }).finally(() => {

            });
    });

    // Read
    // Allows to query _id. Ex: /api/articles?_id=1234567890
    // Allows to sort ex: /api/articles?sort=title&direction=-1
    app.get('/api/articles', (req, res) => {
        const query = req.query._id ? { _id: req.query._id } : {};
        let sortQuery = {};
        let orderQuery = 1;

        if (req.query.direction) orderQuery = parseInt(req.query.direction); 
        if (req.query.sort) sortQuery = {[req.query.sort]: [orderQuery]};

        db.Article.find(query)
            .sort(sortQuery)
            .populate('comments')
            .then(dbArticles => {
                res.json(dbArticles)
            }).catch(err => {
                res.status(400).json(err);
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
                res.status(400).json(err);
            }).finally(() => {

            });
    });

    // Delete
    app.delete('/api/articles/:id', (req, res) => {
        const queryId = req.params.id;
        db.Article.findByIdAndDelete(queryId)
            .then(dbArticle => {
                res.json({ message: 'Succesfully deleted article.', details: dbArticle })
            }).catch(err => {
                res.status(400).json(err);
            }).finally(() => {

            });
    });

    // Delete all
    app.delete('/api/articles', (req, res) => {
        db.Article.deleteMany({})
            .then(dbArticles => {
                res.json({ message: 'Succesfully deleted all articles.', details: dbArticles})
            }).catch(err => {
                res.status(400).json(err);
            }).finally(() => {

            });
    });
};