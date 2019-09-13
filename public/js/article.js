// On main page load, we want to load the queried article
const queryString = window.location.search;
const articleID = queryString.split("=")[1];

$.ajax({
  url: "/api/articles" + queryString,
  method: "GET"
})
  .then(article => {
    article = article.shift();
    renderArticle(article);
    console.log(article);
  })
  .catch(err => {
    alert("Error: See console!");
    console.log(err);
  });

function renderArticle(article) {
  const $article = $("div#article");
  const comments = article.comments;
  const $comments = $("div#comments");
  $article.append(
    `<div>
        ${article.title}
        </div>`
  );
  if (!comments.length) {
    console.log("No comments");
  } else {
    $comments.append(
        `<div>
            comments
        </div>`
    );
  }
}
