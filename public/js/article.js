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

  // Always append the article
  $article.append(
    `<div>
        <span>${article.dateString}</span>
        <a href="#comments">${article.comments.length ? article.comments.length + ' comments' : 'Leave a comment'}</a>
    </div>
    <h1>
        ${article.title}
    </h1>
    <div>
        <span>
            Written by:
        </span>
        <author>
            <a href="${article.author.authorLink}">
                ${article.author.authorName}
            </a>
        </author>
    </div>
    <article>
        <a class="article-teaser" href="${article.link}">
            ${article.teaser}
        </a>
    </article>`
  );

  // Only append comments if there are some
  if (!comments.length) {
    console.log("No comments");
    $comments.append("<div>No comments found. Be the first!</div>");
  } else {
      comments.forEach(comment => {
          $comments.append(
            `<div>
                  ${comment.body}
              </div>`
          );
      });
  }
}

function alertError(err) {
  if (typeof err != "object") return console.log("Not an object!");

  const errorsObj = err.responseJSON.errors;
  // Creates a 'forEach' for the object
  Object.keys(errorsObj).forEach(error => {
    console.log(error, errorsObj[error]);
    alert(errorsObj[error].message);
  });
}

// Handles add comment
$("form.form-comment").on("submit", function(event) {
  event.preventDefault();
  const formData = $(this).serializeArray();
  let formPostData = {};

  // Creates a object suitable for the API
  formData.forEach((item, i) => {
    console.log(item);
    formPostData[item.name] = item.value;
  });

  formPostData.article = articleID;

  $.ajax({
    url: "/api/comments",
    method: "POST",
    data: formPostData
  })
    .then(() => {
      window.location.reload();
    })
    .catch(alertError);
});
