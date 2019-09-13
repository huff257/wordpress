const path = require("path");

module.exports = app => {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../../public/home.html'));
    });
    
    app.get('/find', (req, res) => {
        res.sendFile(path.join(__dirname, '../../public/find.html'));
    });
    
    app.get('/article', (req, res) => {
        res.sendFile(path.join(__dirname, '../../public/article.html'));
    });
}