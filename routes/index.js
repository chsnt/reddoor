let catalog = require('../data/catalog/catalog')

const express = require("express");
const minify = require("express-minify");
const minifyHTML = require("express-minify-html");
const compression = require("compression");
const fs = require("fs-extra");
const emojiFromText = require("emoji-from-text");
const moment = require("moment");
const router = express.Router();

const app = express();

const apxub = "<u> APXUB </u>"

app.use(compression());
app.use(minify());
app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true
    }
  })
);

//

/* GET home page. */
router.get("/", async function(req, res, next) {
  
  // catalog
  let groupsListEnRu = catalog.map(group => group.name)
  let groupsToHTML = (list) => {
    let groupsHTML = ``
    list.forEach( (groups, i) => {
      groupsHTML += `
        <div id=${groups.en}>
          <div class="emoji">${emojiFromText(groups.en, true).match.emoji.char}</div>
          <div><a href="/catalog/${groups.en}">${groups.ru}</a></div>
          <div class="subr">
            <a href="/r/${catalog[i].list[0].en}">${catalog[i].list[0].ru}</a><p>,</p>
            <a href="/r/${catalog[i].list[1].en}">${catalog[i].list[1].ru}</a><p>,</p>
            <a href="/r/${catalog[i].list[2].en}">${catalog[i].list[2].ru}</a><p>...</p>            
          </div>   
        </div>
        `
    })
    return groupsHTML
  }

  const getEmoji = ()=>{
  }

  res.render("main", {
    boards: groupsToHTML(groupsListEnRu),
    apxub: apxub
  }) 

})

/* GET board page. 
...
*/

/* GET post page. */
router.get("/r/:subreddit/:id", async function(req, res, next) {
  //
  // Объявляю здесь т.к. язык м.б. переменным
  moment.locale("ru");

  fs.readJson(`./boards-ru/${req.params.subreddit}/${req.params.id}.json`)
    // fs.readJson(`./data/boards-ru/${req.params.subreddit}/${req.params.id}.json`)
    .then(packageObj => {
      //console.dir(JSON.stringify(packageObj.replies[0].body_html.substr(512).replace(/<\/\s/g, '</'))) // => 0.1.3
      let expand = replies => {
        html = "";
        replies.forEach(comment => {
          // Отступы комментариев
          if (comment.depth > 0) {
            realDepth = comment.depth / 2;
            //html += `<div id="${comment.id}" style="padding-left: ${40+20*(realDepth)}px;" class="${realDepth%2 === 0 ?"gray":"lightgray" }"><hr>
            html += `<div id="${comment.id}" style="margin-left: ${40 +
              20 * realDepth}px;" class="${
              realDepth % 2 === 0 ? "gray" : "lightgray"
            }"><hr>
                  `;
          } else {
            html += `<br><div id="${comment.id}"><hr>
                  `;
          }
          // Информаиция о комментарии

          /*  dateObj = new Date(comment.created_utc * 1000);  */
          let date = new Date(
            comment.created * 1000
          ); /*  dateObj = new Date(comment.created_utc * 1000);  */
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
                      <span> ${moment(utcString).format("lll")} </span>
                    </div>
                  </div>
                </div>`;

          if (comment.replies) {
            if (comment.replies.length > 0) {
              html += expand(comment.replies);
            }
          }
        });

        return html;
      };

      // style="padding-left: 58px;"
      // style="max-height: 700px;"
      let postImg = "";

      if (packageObj.url) {
        const imgs = ["png", "jpg", "gif"];
        let arr = packageObj.url.split(".");

        if (imgs.indexOf(arr[arr.length - 1]) > -1)
          postImg = `
        
        <div class="postImg">
          <a href="${packageObj.url}" target="_blank">
            <div>
            <img alt="${packageObj.subreddit_loc} – ${packageObj.title}" src="${packageObj.url}">
            </div>
          </a>
        </div>`;
      }

      let postDatetime = new Date(
        packageObj.created * 1000
      ); /*  dateObj = new Date(comment.created_utc * 1000);  */
      postDatetime = postDatetime.toUTCString();

      res.render("post", {
        /*  title: packageObj.subreddit.display_name , 
      subr: packageObj.subreddit.display_name ,  */
        title: `${packageObj.subreddit_loc} – ${packageObj.title}`,
        subr: packageObj.subreddit_loc,
        subrEmoji: emojiFromText(req.params.subreddit, true).match.emoji.char,
        postHeader: packageObj.title,
        postImg: postImg,
        postText: packageObj.body ? packageObj.body : packageObj.selftext,

        postScore: packageObj.ups,
        postAuthor: packageObj.author.name,
        postDatetime: moment(postDatetime).format("lll"),

        replies: packageObj.replies,
        expand: "<h2>Обсуждение</h2>" + expand(packageObj.replies),
        apxub: apxub
      });
    })
    .catch(err => {
      console.error(err);
    });
});

module.exports = router;
