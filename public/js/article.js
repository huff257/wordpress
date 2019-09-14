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
    `<div class="mt-5 mb-5">
        <div class="mb-4">
            <div class="mb-3">
                <a href="${article.author.authorLink}">
                    ${article.author.authorName}
                </a>
                wrote:
            </div>
            <h2>
                ${article.title}
            </h2>
        </div>
        <div class="mr-4 mb-4">
            <article>
                <span>
                    ${article.dateString}
                </span>
                ${article.teaser}
            </article>
        </div>
        <div>
            <a href="${article.link}">
                Read more...
            </a>
        </div>
    </div>`
  );

  // Only append comments if there are some
  if (!comments.length) {
    console.log("No comments");
    $comments.append("<div>No comments found. Be the first!</div>");
  } else {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    comments.forEach(comment => {
      const date = new Date(comment.date);
      const dateString = `${months[date.getMonth()]} ${date.getUTCDate() + 1}, ${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}`;
      $comments.append(
        `<div class="mb-4">
            <div class="mb-3">
                <a href="${comment.author.authorLink}">
                    ${comment.author.authorName}
                </a>
                wrote:
                <span>
                    ${dateString}
                </span>
            </div>
            <comment>
                ${comment.body}
            </comment>
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
  formPostData.date = Date.now();

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
