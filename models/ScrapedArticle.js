const mongoose = require('mongoose');

// Get a reference to the mongoose schema constructor
const Schema = mongoose.Schema;

// Make a new constructor function with validators
const ScrapedArticleSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        validate: [
            input => input.length > 1,
            "Article needs a longer name!"
        ]
    },
    link: {
        type: String,
        unique: true,
        required: true,
        validate: [
            input => /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm.test(input),
            "Article needs to be a URL!"
        ]
    },
    teaser: {
        type: String,
        required: true
    },
    dateString: {
        type: String,
        required: true
    },
    author: {
        type: Object,
        required: true,
        validate: [
            input => input.authorName && input.authorLink,
            "Author name AND author link is required!"
        ]
    }
});

// Uses the mongoose constructor to make a new schema
const ScrapedArticle = mongoose.model('ScrapedArticle', ScrapedArticleSchema);

// Exports the model
module.exports = ScrapedArticle;