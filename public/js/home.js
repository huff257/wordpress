// Listen for add comment clicks
$(document).on('click', 'div.add-comment', function(event) {
    console.log($(this).attr('data-_id'));
});

// Articles container element
const $articles = $("div#articles");

// On main page load, we want to load all saved articles
if (window.location.pathname === '/') {
    $.ajax({
        url: '/api/articles',
        method: 'GET'
    }).then(articles => {
        if (!articles.length) {
            removeSpinner();
            renderNoArticles();
        } else {
            removeSpinner();
            renderArticles(articles);
            console.log(articles);
        };
    }).catch(err => {
        alert('Error: See console!');
        console.log(err);
    });
};

function removeSpinner() {
    $articles.find('div.spinner').hide();
}

function renderArticles(articles) {   
    articles.forEach(article => {
        $articles.append(makeArticleMarkup(article));
    });
};

function renderNoArticles() {
    $articles.append(
        `<div class="m-5 text-center">
            <h2 class="article-title">No Articles Found!</h2>
            <span class="color-dark-2">Would you like to <a href="/find">find new articles?</a></span> 
        </div>`
    )
};

function makeArticleMarkup(article) {
    const articleViewUrl = `/article?_id=${article._id}`;
    return (
    `<div class="single-article mt-5 mb-5">
        <div class="mb-4">
            <div class="article-author color-dark-2 mb-2">
                <a href="${article.author.authorLink}">
                    ${article.author.authorName}
                </a>
                wrote:
            </div>
            <h2 class="article-title">
                <a href="${articleViewUrl}">
                    ${article.title}
                </a>
            </h2>
        </div>
        
        <div class="flx flx-row">
            <div class="mr-4 mb-2">
                <article class="home-article">
                    <span class="article-date color-dark-2">
                        ${article.dateString}
                    </span>
                    ${article.teaser}
                </article>
            </div>
            <div class="comments-aside">
                <a href="${articleViewUrl}#comments">
                    ${article.comments.length ? article.comments.length + ' comment(s)' : 'Leave a comment'}
                </a>
            </div>
        </div>
        <div class="color-accent">
            <a href="/article?_id=${article._id}">
                Read more...
            </a>
        </div>
    </div>`
    )
}; 