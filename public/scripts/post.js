function sendPost() {
    let name = document.getElementById("userName").value;
    let message = document.getElementById("userMessage").value;
    let comments = document.querySelector("#commentsBlock");

    let dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric'
    };

    let currentDate = new Date().toLocaleString("ru", dateOptions);
    let newComment = document.createElement('div');

    newComment.innerHTML = `<p>${message.replace(/(<([^>]+)>)/ig, "")}</p>
    <div class="comment_info">
        <div class="score">
            <a rel="nofollow" >⇧</a> <a rel="nofollow"> 0 </a> <a rel="nofollow">⇩</a>
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