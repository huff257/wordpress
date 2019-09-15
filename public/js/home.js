let sortBy = 'date';
let sortDirection = '-1';

let holdHeight = 0;

const $articles = $("div#articles");

// On main page load, we want to load all saved articles. We can also pass a query string to sort.
// getAndShowArticles('?sort=author&direction=1')
getAndShowArticles();

// Listen for sorting input changes
$('input[type="radio"][name="sort"]').change(function (event) {
    sortBy = $(this).val();
    getAndShowArticles();
});

// Listen for sort direction changes
$('i.sort-direction').on('click', function (event) {
    $arrow = $('i.sort-direction');
    if (sortDirection === '-1') {
        sortDirection = '1';
        $arrow.css('transform', 'rotate(180deg)');
    } else {
        sortDirection = '-1';
        $arrow.css('transform', 'rotate(360deg)');
    };
    getAndShowArticles();
});

function getAndShowArticles() {
    holdHeight = $articles.height();
    console.log(holdHeight);
    $articles.height(holdHeight + 'px');
    $articles.empty(); 
    toggleSpinner(true);

    console.log('/api/articles?sort=' + sortBy + '&direction=' + sortDirection)

    $.ajax({
        url: '/api/articles?sort=' + sortBy + '&direction=' + sortDirection,
        method: 'GET'
    }).then(articles => {
        if (!articles.length) {
            renderNoArticles();
        } else {
            articles.forEach(article => {
                $articles.append(makeArticleMarkup(article));
            });
            console.log(articles);
        };
    }).catch(err => {
        alert('Error: See console!');
        console.log(err);
    }).always(function () {
        toggleSpinner(false);
        $articles.css('height', '');
    });
};

function toggleSpinner(bool = false) {
    if (bool) $(document).find('div.spinner').show();
    else $(document).find('div.spinner').hide();
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
        <div class="mb-3">
            <div class="article-author color-dark-2 mb-3">
                <a href="${article.author.authorLink}" target="_blank">
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
        <div class="read-more color-accent">
            <a href="/article?_id=${article._id}#textarea-comment">
                Read more...
            </a>
        </div>
    </div>`
    )
};