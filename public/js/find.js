let scrapeData;
const $articles = $("div#articles");

// Listen for save article clicks
$(document).on('click', 'button.save', function (event) {
    const scrapedID = $(this).attr('data-_id');
    const chosenArticle = scrapeData.created.filter(article => article._id === scrapedID).shift();
    chosenArticle.date = Date.now();

    $.ajax({
        url: '/api/articles',
        method: 'POST',
        data: chosenArticle
    }).then(data => {
        window.location.href = '/'
    }).catch(err => {
        alert('Got an error! See console.');
        console.log(err);
    });
});

// Listen for scrape on find page
$.ajax({
    url: '/scrape',
    method: 'GET'
}).then(data => {
    $.ajax({
        url: '/api/articles',
        method: 'GET'
    }).then(dbArticles => {
        scrapeData = data;
        removeSpinner();
        renderArticles(data.created, dbArticles);
    }).catch(err => {
        alert('Got an error! See console.');
        console.log(err);
    });
}).catch(err => {
    alert('Got an error! See console.');
    console.log(err);
});

function removeSpinner() {
    $articles.find('div.spinner').hide();
}

function renderArticles(articles, dbArticles) {
    const currentTitles = [];
    dbArticles.forEach(article => currentTitles.push(article.title));

    articles.forEach(article => {
        if (currentTitles.includes(article.title)) {
            console.log("Already have: ", article.title);
        } else {
            $articles.append(makeArticleMarkup(article));
        };
    });
};

function makeArticleMarkup(article) {
    return (
        `<div class="single-article mb-5 p-3 bg-light-2 rounded">
            <div class="mb-4">
                <div class="article-author color-dark-2 mb-2">
                    <a href="${article.author.authorLink}" target="_blank">
                        ${article.author.authorName}
                    </a>
                    wrote:
                </div>
                <h2 class="article-title">
                    <a href="${article.link}" target="_blank">
                        ${article.title}
                    </a>
                </h2>
            </div>
            <div class="mr-4 mb-2">
                <article class="home-article">
                    <span class="date color-dark-2">
                        ${article.dateString}
                    </span>
                    ${article.teaser}
                </article>
            </div>
            <button class="save button button-light" data-_id="${article._id}">Add to Articulate</button>
        </div>`
    )
}

{/* <h2><a href="${article.link}">${article.title}</a></h2>
    <h3><a href="${article.author.authorLink}">${article.author.authorName}</a></h3>
    <p>${article.teaser}</p>
    <button id='save' class='button' data-_id='${article._id}'>Add to Site</button> */}