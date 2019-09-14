$(document).on('click', 'button.sort-date', function(event) {
    getAndShowArticles('?sort=date&direction=-1');
});
$(document).on('click', 'button.sort-title', function(event) {
    getAndShowArticles('?sort=title&direction=1');
});
$(document).on('click', 'button.sort-comments', function(event) {
    getAndShowArticles('?sort=comments&direction=-1');
});
$(document).on('click', 'button.sort-author', function(event) {
    getAndShowArticles('?sort=author&direction=1');
});

// Articles container element
const $articles = $("div#articles");

// On main page load, we want to load all saved articles. We can also pass a query string to sort.
// getAndShowArticles('?sort=author&direction=1')
getAndShowArticles();

function getAndShowArticles(query = '?sort=date&direction=-1') {
    clearArticles();
    toggleSpinner(true);

    $.ajax({
        url: '/api/articles' + query,
        method: 'GET'
    }).then(articles => {
        if (!articles.length) {
            renderNoArticles();
        } else {
            renderArticles(articles);
            console.log(articles);
        };
    }).catch(err => {
        alert('Error: See console!');
        console.log(err);
    }).always(function() {
        console.log("Setting to false...")
        toggleSpinner(false);
    });
};

function toggleSpinner(bool = false) {
    if (bool) $(document).find('div.spinner').show();
    else $(document).find('div.spinner').hide();
}

function renderArticles(articles) {
    articles.forEach(article => {
        $articles.append(makeArticleMarkup(article));
    });
};

function clearArticles() {
    $articles.empty();
}

function renderNoArticles() {
    $articles.append(
        `<div class="m-5 text-center">
            <h2 class="article-title">No Articles Found!</h2>
            <span class="color-dark-2">Would you like to <a href="/find">find new articles?</a></span> 
        </div>`
    )
};

function makeArticleMarkup(article) {
    article.link = `/article?_id=${article._id}`;
    return (
        `<div class="mb-lg">
        <div class="mb-4">
            <div class="article-author color-dark-2 mb-2">
                <a href="${article.author.authorLink}">
                    ${article.author.authorName}
                </a>
                wrote:
            </div>
            <h2 class="article-title">
                <a href="${article.link}">
                    ${article.title}
                </a>
            </h2>
        </div>
        
        <div class="flx flx-row">
            <div class="mr-4 mb-2">
                <article class="home-article">
                    <span class="date color-dark-2">
                        ${article.dateString}
                    </span>
                    ${article.teaser}
                </article>
            </div>
            <div class="comments-aside">
                <a href="${article.link}#comments">
                    ${article.comments.length ? article.comments.length + ' comment(s)' : 'Leave a comment'}
                </a>
            </div>
        </div>
        <div class="color-accent">
            <a href="/article?_id=${article._id}#textarea-comment">
                Read more...
            </a>
        </div>
    </div>`
    )
}; 