// Server dependencies
const express = require('express');
const app = express();

const PORT = 8080;

// Other dependencies
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/articlesdb', {useNewUrlParser: true});
const db = mongoose.connection;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Route handling
require('./routing/html-routes')(app);
require('./routing/api-routes')(app);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    app.listen(PORT, function() {
        console.log('Listening on PORT: ' + PORT);
    });
})

// For testing purposes
module.exports = app;