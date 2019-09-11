// Require all models
const db = require('../../models');

module.exports = app => {

    // Create
    app.post('/api/comments', (req, res) => {
        db.Comment.create(req.body)
            .then(dbComment => {
                db.Article.findByIdAndUpdate(req.body.article, {$push: {comments: dbComment._id}}, {new: true})
                    .then(dbArticle => {
                        res.json({dbComment, article: dbArticle});
                    }).catch(err => {
                        res.status(404).json(err);
                    }).finally(() => {

                    });
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
        db.Comment.findByIdAndUpdate(queryId, req.body, { new: true })
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

    // Delete all
    app.delete('/api/comments', (req, res) => {
        db.Comment.deleteMany({})
            .then(dbComment => {
                res.json({ message: 'Succesfully deleted all comments.', details: dbComment })
            }).catch(err => {
                res.status(404).json(err);
            }).finally(() => {

            });
    });
    
};