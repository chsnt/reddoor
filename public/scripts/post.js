let dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric'
};

function toggleDarkTheme() {
    let bodyType = document.querySelector('body');
    bodyType.classList.toggle('dark-theme');
};

function sendPost() {
    let name = document.querySelector(".userName").value;
    let message = document.querySelector(".userMessage").value;
    let comments = document.querySelector("#commentsBlock");
    let currentDate = new Date().toLocaleString("ru", dateOptions);
    let newComment = document.createElement('div');

    newComment.innerHTML = `<p>${message.replace(/(<([^>]+)>)/ig, "")}</p>
    <div class="answer">
        <a href="#bottom">Ответить</a>
    </div>
    <div class="comment_info">
        <div class="score">            
          <a class="scoreUp" onclick="scoreUp(this);" rel="nofollow" >⇧</a> <a class="dispScore" rel="nofollow">0</a> <a class="scoreDown" onclick="scoreDown(this);" rel="nofollow" >⇩</a>            
        </div>
        <div class="author">
            <span> ${name.replace(/(<([^>]+)>)/ig, "")} </span>
        </div>
        <div class="datetime">
            <span> ${currentDate} </span>
        </div>
    </div> `;
    comments.appendChild(newComment);
}

function scoreUp(post) {
    let score = post.parentElement.querySelector(".dispScore");
    let number = parseInt(score.innerHTML) + 1;
    score.innerHTML = number;
    score.parentElement.classList.add("blockedUp");
}

function scoreDown(post) {
    let score = post.parentElement.querySelector(".dispScore");
    let number = parseInt(score.innerHTML) - 1;
    score.innerHTML = number;
    score.parentElement.classList.add("blockedDown");
}