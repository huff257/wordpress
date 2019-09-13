// Listen for save article clicks
$(document).on('click', 'button#save', function(event) {
    console.log($(this).attr('data-_id'));
});

// Listen for scrape on find page
if (window.location.pathname === '/find') {
    $.ajax({
        url: '/scrape',
        method: 'GET'
    }).then(data => {
        renderArticles(data.created);
        console.log(data);
    }).catch(err =>{
        alert('Got an error! See console.');
        console.log(err);
    })
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
            <h2><a href="${article.link}">${article.title}</a></h2>
            <h3><a href="${article.author.authorLink}">${article.author.authorName}</a></h3>
            <p>${article.teaser}</p>
            <button id='save' data-_id='${article._id}'>Add to Site</button>
        </div>`
    )
}