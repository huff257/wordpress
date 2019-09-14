// Server dependencies
const express = require('express');
const app = express();

const PORT = 8080;

// Other dependencies
const mongoose = require('mongoose');
const path = require('path');

// Set up the environment variables; production db url by default
const env = process.env.NODE_ENV || 'production';
const dbUrl = process.env.MONGODB_URI || require('./config')[env];
console.log("Loading DB with url: ", dbUrl);

// Run with corresponding dbUrl
mongoose.connect(dbUrl, {useNewUrlParser: true});
const db = mongoose.connection;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Route handling
require('./routing/html/html.routes')(app);
require('./routing/api/api.articles')(app);
require('./routing/api/api.comments')(app);
require('./routing/api/api.scrape')(app);
require('./routing/api/api.temp-articles')(app);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    app.listen(PORT, function() {
        console.log('Listening on PORT: ' + PORT);
    });
})

// For testing purposes
module.exports = app;