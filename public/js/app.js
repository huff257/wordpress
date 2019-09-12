// On page load we want to load all temporary articles
$.ajax({
    url: '/api/scraped/articles',
    method: 'GET'
}).then(articles => {
    renderArticles(articles);
    console.log(articles);
}).catch(err => {
    alert('Error: See console!');
    console.log(err);
});

function renderArticles(articles) {
    const $articles = $("div#articles");
    
    articles.forEach(article => {
        $articles.append(makeArticleMarkup(article));
    });
};

function makeArticleMarkup(article) {
    return (
        `<div>
            <h2>${article.title}</h2>
            <a href="${article.link}">Link</a>
        </div>`
    )
}

function alertError(err) {
    if (typeof(err) != 'object') return console.log('Not an object!');

    const errorsObj = err.responseJSON.errors;
    // Creates a 'forEach' for the object
    Object.keys(errorsObj).forEach(error => {
        console.log(error, errorsObj[error]);
        alert(errorsObj[error].message);
    });
}

// Handles add comment
$('form.form-comment').on('submit', function (event) {
    event.preventDefault();
    const formData = $(this).serializeArray();
    let formPostData = {};

    // Creates a object suitable for the API
    formData.forEach((item, i) => {
        console.log(item);
        formPostData[item.name] = item.value;
    });

    $.ajax({
        url: '/api/comments',
        method: 'POST',
        data: formPostData
    }).then(() => {
        alert('posted');
        console.log(thing);
    }).catch(alertError);
});