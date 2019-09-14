const mongoose = require('mongoose');

// Get a reference to the mongoose schema constructor
const Schema = mongoose.Schema;

// Make a new constructor function with validators
const ArticleSchema = new Schema({
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
            "Article link needs to be a URL!"
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
    date: {
        type: Number
    },
    author: {
        type: Object,
        required: true,
        validate: [
            input => input.authorName && input.authorLink,
            "Author name AND author link is required!"
        ]
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Comment"
        }
    ]
});

// Uses the mongoose constructor to make a new schema
const Article = mongoose.model('Article', ArticleSchema);

// Exports the model
module.exports = Article;