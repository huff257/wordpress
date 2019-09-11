const mongoose = require('mongoose');

// Get a reference to the mongoose schema constructor
const Schema = mongoose.Schema;

// Make a new constructor function with validators
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        validate: [
            input => input.length > 1,
            "Article needs a longer name!"
        ]
    },
    link: {
        type: String,
        required: true,
        validate: [
            input => /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm.test(input),
            "Article needs to be a URL!"
        ]
    }
});

// Uses the mongoose constructor to make a new schema
const Article = mongoose.model('Article', ArticleSchema);

// Exports the model
module.exports = Article;