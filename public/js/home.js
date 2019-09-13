// Listen for add comment clicks
$(document).on('click', 'div.add-comment', function(event) {
    console.log($(this).attr('data-_id'));
});

// On main page load, we want to load all saved articles
if (window.location.pathname === '/') {
    $.ajax({
        url: '/api/articles',
        method: 'GET'
    }).then(articles => {
        renderArticles(articles);
        console.log(articles);
    }).catch(err => {
        alert('Error: See console!');
        console.log(err);
    });
};

function renderArticles(articles) {
    const $articles = $("div#articles");
    
    articles.forEach(article => {
        $articles.append(makeArticleMarkup(article));
    });
};

function makeArticleMarkup(article) {
    return (
        `<div style='color: white'>
            <h2>${article.title}</h2>
            <author>
                <a href="${article.author.authorLink} target="_blank">
                    ${article.author.authorName}
                </a>
            </author>
            <article>
                <a class="article-teaser" href="/article?_id=${article._id}">
                    ${article.teaser}
                </a>
            </article>
            <div class="add-comment" data-_id='${article._id}'>
                <svg class="comment" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="33px"
                    height="27.9px" viewBox="0 0 33 27.9" style="enable-background:new 0 0 33 27.9;" xml:space="preserve">
                    <g>
                        <path d="M16.5,2C24.4,2,31,5.9,31,10.5c0,2.1-1.4,4.2-4.1,5.8c-0.4,0.2-0.6,0.5-0.8,0.9c-1,2.4-3,4.6-5.5,6.2
                        c0.3-0.7,0.5-1.4,0.7-2.1c0.2-0.6,0-1.3-0.4-1.8c-0.4-0.4-0.9-0.7-1.5-0.7c-0.1,0-0.2,0-0.2,0c-0.9,0.1-1.8,0.2-2.7,0.2
                        C8.6,19,2,15.1,2,10.5S8.6,2,16.5,2 M16.5,0C7.4,0,0,4.7,0,10.5S7.4,21,16.5,21c1,0,2-0.1,2.9-0.2c-0.7,2.6-2.3,5.1-4.6,7.1
                        c0.3-0.1,0.7-0.1,1-0.2c5.8-1.5,10.3-5.3,12.1-9.6c3.1-1.9,5-4.6,5-7.5C33,4.7,25.6,0,16.5,0L16.5,0z"/>
                    </g>
                </svg>
                <span>${article.comments.length}</span>
            </div>
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