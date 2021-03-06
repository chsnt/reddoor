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

    newComment.innerHTML = `<hr>
    <div class="comment_info">
        <div class="author">
            <span> ${name.replace(/(<([^>]+)>)/ig, "")} </span>
        </div>
        <div class="datetime">
            <span> ${currentDate} </span>
        </div>
    </div>
    <p>${message.replace(/(<([^>]+)>)/ig, "")}</p>    
    <div class="comment_info_bottom">
        <div class="score">
          <a class="scoreUp" onclick="scoreUp(this);" rel="nofollow" >⇧</a> <a class="dispScore" rel="nofollow">0</a> <a class="scoreDown" onclick="scoreDown(this);" rel="nofollow" >⇩</a>
        </div> 
        <button class="answer" onclick="goDown();">
        Ответить
    </button>       
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

function goDown() {
    document.querySelector('.userMessage').focus();
}

function goUp() {
    document.querySelector('.wrapper-header').scrollIntoView();
}