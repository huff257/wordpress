const mongoose = require('mongoose');

// Get a reference to the mongoose schema constructor
const Schema = mongoose.Schema;

// Make a new constructor function with validators
const CommentSchema = new Schema({
    body: {
        type: String,
        required: true,
        trim: true,
        minlength: [1, "Requires at least 1 character!"],
        maxlength: [500, "Comments canot be less than 500 characters!"],
    },
    article: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Article"
    },
    author: {
        authorName: {
            type: String,
            required: true,
            trim: true,
            minlength: [1, "Requires at least 1 character!"],
            maxlength: [20, "Can't be more than 20 characters!"]
        },
        authorTwitter: {
            type: String,
            required: true,
            trim: true
        }
    },
    date: {
        type: Number,
        required: true
    }
});

// Uses the mongoose constructor to make a new schema
const Comment = mongoose.model('Comment', CommentSchema);

// Exports the model
module.exports = Comment;