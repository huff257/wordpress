// On main page load, we want to load the queried article
const queryString = window.location.search;
const articleID = queryString.split("=")[1];
const $article = $("div#article");
const $comments = $("div#comments");

$(document).on('click', 'i.remove-comment', function(event) {
  removeComment($(this).attr('data-_id'));
});

$.ajax({
  url: "/api/articles" + queryString,
  method: "GET"
})
  .then(article => {
    article = article.shift();
    removeSpinner();
    renderArticle(article);
    console.log(article);
  })
  .catch(err => {
    console.log(err)
  });

function renderArticle(article) {
  const comments = article.comments;

  // Always append the article
  $article.append(
    `<div class="single-article mt-5 mb-5">
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
                <span class="article-date color-dark-2">
                    ${article.dateString}
                </span>
                ${article.teaser}
            </article>
        </div>
        <div class="color-accent">
            <a href="${article.link}" target="_blank">
                Read more on Smashing...
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
        `<div class="mb-3 p-2 bg-light-2 rounded-1">
            <div class="mb-3 flx flx-row flx-justify-between">
                <div>
                  <a href="https://www.twitter.com/${comment.author.authorTwitter}" target="_blank">
                      ${comment.author.authorName}
                  </a>
                  wrote:
                  <span class="date">
                      ${dateString}
                  </span>
                </div>
                <div>
                  <i class="fas fa-times cursor-pointer remove-comment" data-_id='${comment._id}'></i>
                </div>
            </div>
            <comment>
                ${comment.body}
            </comment>
        </div>`
      );
    });
  }
}

function removeSpinner() { $article.find('div.spinner').hide(); }

function removeComment(commentID) {
  if (confirm("Are you sure you want to delete this comment?")) {
    $.ajax({
      url: '/api/comments/' + commentID,
      method: 'DELETE'
    }).then(data => {
      window.location.reload();
    }).catch(err => {
      console.log(err);
      alert('There was an error submitting the request. Please try again later.');
    });
  };
};

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
$("form.form-comment").on("submit", function (event) {
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
