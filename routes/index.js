const express = require('express');
const fs = require('fs-extra');
const moment = require('moment')
const router = express.Router();


/* GET home page. */
router.get('/', async function(req, res, next) {

  // 
    // Объявляю здесь т.к. язык м.б. переменным
  moment.locale('ru');

  fs.readJson('dshpg0.json')
  .then(packageObj => {
    //console.dir(JSON.stringify(packageObj.replies[0].body_html.substr(512).replace(/<\/\s/g, '</'))) // => 0.1.3
    let expand = (replies) => { 
      html = ''
      replies.forEach(comment => {        
        
        // Отступы комментариев
        if(comment.depth>0){
          html += `<div id="${comment.id}" style="padding-left: ${40+20*(comment.depth/2)}px;"><hr>
                  `
        } else {
          html += `<br><div id="${comment.id}"><hr>
                  `
        }
        // Информаиция о комментарии

       /*  dateObj = new Date(comment.created_utc * 1000);  */
        let date = new Date(comment.created * 1000)  /*  dateObj = new Date(comment.created_utc * 1000);  */ 
        utcString = date.toUTCString();
        
        html += `${comment.body_html}
                  <div class="comment_info"> 
                    <div class="score">
                     <a>⇧</a> <a> ${comment.ups} </a> <a>⇩</a>
                    </div>
                    <div class="author">
                      <span> ${comment.author} </span>
                    </div>
                    <div class="datetime">
                      <span> ${moment(utcString).format('LLL')} </span>
                    </div>
                  </div>
                </div>`


        if (comment.replies) {
          if (comment.replies.length>0) {
            html += expand( comment.replies )  
          } 
        } 
      });

      return html

    }


    // style="padding-left: 58px;"
    // style="max-height: 700px;"
     let postImg = ''

     if (packageObj.url) { 
      const imgs = ['png', 'jpg', 'gif']
      let arr = packageObj.url.split('.')
      
      if( imgs.indexOf(arr[arr.length-1])>-1 ) postImg = `
        <a href="${packageObj.url}" target="_blank">
          <img alt="post-image" src="${packageObj.url}" height="700">
        </a>`

    }

    let postDatetime = new Date(packageObj.created * 1000)  /*  dateObj = new Date(comment.created_utc * 1000);  */ 
    postDatetime = postDatetime.toUTCString();

    res.render('index', { 
     /*  title: packageObj.subreddit.display_name , 
      subr: packageObj.subreddit.display_name ,  */
      title: `${packageObj.subreddit_loc} – ${packageObj.title}` , 
      subr: packageObj.subreddit_loc , 
      postHeader : packageObj.title,
      postImg : postImg,
      postText : packageObj.body,

      postScore: packageObj.ups,
      postAuthor: packageObj.author.name,
      postDatetime: moment(postDatetime).format('LLL'),

      replies: packageObj.replies, 
      expand: '<h2>Обсуждение</h2>' + expand(packageObj.replies),
      apxub: '<u> APXUB </u>'
    });


  })
  .catch(err => {
    console.error(err)
  })


});

module.exports = router;
