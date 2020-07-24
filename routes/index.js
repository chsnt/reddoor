let catalog = require('../data/catalog/catalog')

const express = require("express");
const minify = require("express-minify");
const minifyHTML = require("express-minify-html");
const compression = require("compression");
const fse = require("fs-extra");
const fs = require("fs");
const emojiFromText = require("emoji-from-text");
const moment = require("moment");
const helmet = require('helmet')


const router = express.Router();

const lang = 'ru'
moment.locale(lang);

const showdown = require('showdown'),
  markdowner = new showdown.Converter()
markdowner.setOption('simplifiedAutoLink', 'true');
markdowner.setOption('metadata', 'true');
markdowner.setOption('parseImgDimensions', 'true');
markdowner.setOption('disableForced4SpacesIndentedSublists', 'true');
markdowner.setOption('headerLevelStart', 3);
//console.log(markdowner.getOptions())

const app = express();

const catalogWOG = fse.readJSONSync('./data/catalog/catalogWOG.json')
const catalogIndex = fse.readJSONSync('./data/catalog/index.json')

const getEmoji = (text) => emojiFromText(text, true).match.emoji["char"]

const slogan = "Источник идей, материалов, контента для статей"
const mainHeader = "Материал для статей Вашего блога"

const apxub = '<u> APXUB </u>'
const email = 'mail@apxub.com'
const yandexBar = `<div class="ya-share2" data-services="collections,vkontakte,facebook,odnoklassniki,moimir,whatsapp,telegram" data-limit="3"></div>`
const toggleDarkTheme = `<div class="onoffswitch" style="display: inline-block;vertical-align: text-bottom;">
<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch">
    <label class="onoffswitch-label" for="myonoffswitch" onclick="if (!window.__cfRLUnblockHandlers) return false; toggleDarkTheme();"></label>
    </div>`
/* const toggleDarkTheme = `<div class="onoffswitch" style="display: inline-block;vertical-align: text-bottom;">
<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" onchange="toggleDarkTheme();">
<label class="onoffswitch-label" for="myonoffswitch">Ночной режим</label>
</div>` */



app.use(helmet())
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

//

/* GET home page. */
router.get("/", async function (req, res, next) {


  // catalog
  let groupsListEnRu = catalog.map(group => group.name)
  let groupsToHTML = (list) => {
    let groupsHTML = ``
    list.forEach((groups, i) => {
      groupsHTML += `
        <div id=${groups.en} class="catalog">
          <div class="emoji">${getEmoji(groups.en)}</div>
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

  res.render("main", {
    title: slogan + " | АРХИВ ⚡",
    header: "АРХИВ - " + mainHeader,
    description: "Где найти идеи для блога, паблика, канала? Предлагаем каталог бесплатной ценной информации из всего интернета. " + slogan,
    boards: groupsToHTML(groupsListEnRu),
    apxub: apxub,
    email: 'mailto:' + email,

  })

})

/* GET home page. */
router.get("/catalog/:group", async function (req, res, next) {

  // catalog
  let boardsCatalog = catalog.filter(group => group.name.en === req.params.group)[0]
  let groupName = boardsCatalog.name
  let boardsList = boardsCatalog.list
  boardsList = boardsList.filter(board => catalogIndex[board.en] !== undefined && catalogIndex[board.en].length > 0)

  let boardsToHTML = (list) => {
    let groupsHTML = ``
    list.forEach(board => {
      groupsHTML += `
        <div id=${board.en}>
          <div class="emoji">${getEmoji(board.en)}</div>
          <div class="subr">
            <a href="/r/${board.en}">${board.ru}</a>        
          </div>   
        </div>
        `
    })
    return groupsHTML
  }

  res.render("boards", {
    title: groupName.ru + ' | APXUB',
    boards: boardsToHTML(boardsList),
    apxub: apxub,
    email: 'mailto:' + email
  })

})

/* GET home page. */
router.get("/r/:subreddit", async function (req, res, next) {

  let page = req.query.page
  page = (page !== undefined) ? Number(page) : 1
  if (page === 0) page = 1

  console.log(page)
  console.log(page !== NaN)
  // console.log(page !== undefined )
  // console.log(!(page instanceof Number) && (page !== undefined) )
  if (page === NaN) {
    res.redirect(`/r/${req.params.subreddit}`);
    next()
  }

  const limit = 10
  let subreddit = req.params.subreddit
  console.log(catalogIndex[subreddit])
  const lastPage = (catalogIndex[subreddit] !== undefined) ?
    (catalogIndex[subreddit].length < limit) ? catalogIndex[subreddit].length : Math.floor(catalogIndex[subreddit].length / limit) : 0

  // catalog
  const catalogWOG = require('../data/catalog/catalogWOG')
  let subredditName = catalogWOG.filter(subr => subr.en === subreddit)[0]
  //console.log(subredditName)

  let treadsToHTML = (list, page, limit) => {
    let groupsHTML = ``
    list.forEach((tread, i) => {
      const num = Number(tread.ORDER)
      const start = (page === undefined || page === 0) ? 0 : limit * (page - 1)
      const end = page * limit

      if ((start < num) && (num <= end)) {
        groupsHTML += `
              <div id=${tread.ID} class="tread">
                <div class="score">${tread.SCORE}</div>
                <div class="tread">
                  <a href="/r/${subreddit}/${tread.ID}">${tread.NAME}</a>        
                </div>   
                <div class="date">${moment((new Date(tread.DATE * 1000)).toUTCString()).format("LL")}</div>
              </div>
              `
      }
    })
    return groupsHTML
  }

  const paginator = (page, lastPage) => {
    let str = ``

    if (lastPage <= 1) return `<li class="active">1</li>`
    if (lastPage === 2 && page === 1) return `<li class="active">1</li>
                              <li class="next">
                                      <a href="/r/${subreddit}?page=2">2
                                      </a>
                                    </li>`
    if (lastPage === 2 && page === 2) return `
                              <li class="first">
                                      <a href="/r/${subreddit}?page=1">1
                                      </a>
                                    </li>
                              <li class="active">2</li>`
    if (page === 1) {
      str += `<li class="active">1</li>
                    `
      str += `<li class="next">
                      <a href="/r/${subreddit}?page=2">2
                      </a>
                    </li>
                    `
      str += `<li class="between">
                      <span>...</span>
                    </li>
                    `
      str += `<li class="last">
                      <a href="/r/${subreddit}?page=${lastPage}">
                      ${lastPage}
                      </a>
                    </li>`

    } else if (page === 2) {
      str += `<li class="first">
                      <a href="/r/${subreddit}?page=1">1
                      </a>
                    </li>
                    `
      str += `<li class="active">2</li>
                    `
      str += `<li class="next">
                      <a href="/r/${subreddit}?page=3">3
                      </a>
                    </li>
                    `
      str += `<li class="between">
                      <span class="text">...</span>
                    </li>
                    `
      str += `<li class="last">
                      <a href="/r/${subreddit}?page=${lastPage}">
                      ${lastPage}
                      </a>
                    </li>`

    } else if (page === lastPage) {

      // Последняя
      str += `<li class="first">
                      <a href="/r/${subreddit}?page=1">1
                      </a>
                    </li>
                    `
      str += `<li class="between">
                      <span class="text">...</span>
                    </li>                    
                    `
      str += `<li class="previous">
                      <a href="/r/${subreddit}?page=${page - 1}">${page - 1}
                      </a>
                    </li>
                    `
      str += `<li class="active">${page}</li>`

    } else if (page === lastPage - 1) {

      // ПРЕДпоследняя
      str += `<li class="first">
                      <a href="/r/${subreddit}?page=1">1
                      </a>
                    </li>
                    `
      str += `<li class="between">
                      <span class="text">...</span>
                    </li>                    
                    `
      str += `<li class="previous">
                      <a href="/r/${subreddit}?page=${page - 1}">${page - 1}
                      </a>
                    </li>
                    `
      str += `<li class="active">${page}</li>`
      str += `<li class="last">
                      <a href="/r/${subreddit}?page=${lastPage}">
                      ${lastPage}
                      </a>
                    </li>
                    `

    } else {

      str += `<li class="first">
                      <a href="/r/${subreddit}?page=1">1
                      </a>
                    </li>
                    `
      if (page > 3) str += `<li class="between">
                      <span class="text">...</span>
                    </li>                    
                    `

      str += `<li class="previous">
                      <a href="/r/${subreddit}?page=${page - 1}">${page - 1}
                      </a>
                    </li>
                    `
      str += `<li class="active">${page}</li>
                   `
      str += `<li class="next">
                      <a href="/r/${subreddit}?page=${page + 1}">${page + 1}
                      </a>
                    </li>
                   `
      if (page < lastPage - 2) str += `<li class="between">
                   <span class="text">...</span>
                 </li>                    
                 `
      str += `<li class="last">
                      <a href="/r/${subreddit}?page=${lastPage}">
                      ${lastPage}
                      </a>
                    </li>`
    }

    return str
  }
  console.log('lastPage = ' + lastPage)
  res.render("treads", {
    title: subredditName.ru + ' | APXUB',
    subr: `<a href="/r/${subreddit}">${subredditName.ru}</a>`,
    subrEmoji: getEmoji(subreddit),
    treads: (lastPage !== 0) ? treadsToHTML(catalogIndex[subreddit], page, limit) : '',
    apxub: apxub,
    email: 'mailto:' + email,
    pages: paginator(page, lastPage)
  })
})
//let boards = catalog.filter(group => group.name.en === req.params.group)[0]
//let groupName = boards.name
//let boardsList = boards.list


/* GET board page. 
...
*/


router.get("/r/:subreddit/comments/:id", async function (req, res, next) {
  res.redirect(`/r/${req.params.subreddit}/${req.params.id}`);

})

/* GET post page. */
router.get("/r/:subreddit/:id", async function (req, res, next) {
  //
  // Объявляю здесь т.к. язык м.б. переменным

  fse.readJson(`../data/boards-ru/${req.params.subreddit}/${req.params.id}.json`)
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

          let commentToHtml = (comment.body_html !== undefined) ?
            comment.body_html :
            mdToHtml(comment.body)

          html += `${commentToHtml}
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

      let subr_lang = (packageObj.subreddit_lang) ? packageObj.subreddit_lang : catalogWOG.find(s => s.en === packageObj.subreddit.display_name).ru
      let comments = (packageObj.replies) ? "<h2>Обсуждение</h2>" + expand(packageObj.replies) : ""
      comments = comments.replace(/(<a[^>]*)(>)([^<]+)(<\/a>)/g, (match, p1, p2, p3, p4, offset, string) => [p1, ` rel="nofollow" `, p2, p3, p4].join(''))

      // console.log(packageObj.selftext.replace(/\[(.{2,128})\]\s\((.*)\)/, (...g) => `[${g[1]}] (${()=>g[2].replace(/\s+/g, '')})`))
      console.log(packageObj.selftext.match(/\[(.{2,128})\]\s\((.*)\)/g))
      let postText
      if (packageObj.body) {
        postText = packageObj.body
      } else if (packageObj.selftext && packageObj.selftext.length > 0) {
        postText = mdToHtml(packageObj.selftext)
      } else if (packageObj.url) {
        // Парсим imgur
        regexImgur = /imgur.com\//gm
        regexGfycat = /gfycat.com\//gm
        regexYoutube = /youtube.com\//gm
        regexYoutu_be = /youtu.be\//gm
        regexTwitter = /twitter.com\//gm
        regexRedd_it = /.redd.it\//gm
        regexReddit = /reddit.com\//gm

        if (regexImgur.test(packageObj.url)) {
          regexDataID = /(imgur.com\/)(\w+)(\.)/gm
          dataID = regexDataID.exec(packageObj.url)[2]
          // console.log(dataID)
          postText = `<blockquote class="imgur-embed-pub" lang="${lang}" data-id="${dataID}">
          <a href="${packageObj.url}">${packageObj.title}</a>
          </blockquote>
          <script async src="http://s.imgur.com/min/embed.js" charset="utf-8"></script>`

          // gfycat.com/
        } else if (regexGfycat.test(packageObj.url)) {
          regex = /(gfycat.com\/)(\w+)/gm
          //console.log(regex.exec(packageObj.url))
          url = packageObj.url.replace(regex, `$1ifr\/$2`);

          postText = `<div style='position:relative;padding-bottom:calc(100% / 1.85)'>
          <iframe src='${url}' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' allowfullscreen>
          </iframe>
          </div>`

          // youtube
        } else if (regexYoutube.test(packageObj.url)) {
          regex = /(youtube.com\/)(\w+)/gm
          console.log(regex.exec(packageObj.url))
          url = packageObj.url.replace(regex, `$1embed\/$2`);
          postText = `<iframe width="616" height="380" src="${url}?cc_load_policy=1&cc_lang_pref=${lang}"></iframe>`;

          // youtu.be
        } else if (regexYoutu_be.test(packageObj.url)) {
          regex = /(youtu.be\/)(\w+)/gm
          //console.log(regex.exec(packageObj.url))
          url = packageObj.url.replace(regex, `youtube.com/embed\/$2`);
          postText = `<iframe width="616" height="380" src="${url}?cc_load_policy=1&cc_lang_pref=${lang}"></iframe>`;

          // redd.it
        } else if (regexRedd_it.test(packageObj.url)) {
          regex = /(redd.it\/)(\w+)/gm
          console.log(regex.exec(packageObj.url))
          postText = `<blockquote class="reddit-card" ><a href="${packageObj.url}"></blockquote>
          <script async src="//embed.redditmedia.com/widgets/platform.js" charset="UTF-8"></script>`;

          // reddit.com
        } else if (regexReddit.test(packageObj.url)) {
          postText = `<blockquote class="reddit-card" ><a href="${packageObj.url}"></blockquote>
          <script async src="//embed.redditmedia.com/widgets/platform.js" charset="UTF-8"></script>`;

          // twitter
        } else if (regexTwitter.test(packageObj.url)) {
          postText = `<blockquote class="twitter-tweet" data-lang="${lang}"><p lang="${lang}" dir="ltr">
          <a href="${packageObj.url}">${packageObj.title}</a>
          </blockquote> 
          <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`


        } else if (["png", "jpg", "gif"].indexOf(packageObj.url.split(".")[packageObj.url.split(".").length - 1]) > -1) {

          postText = ` <div class = "postImg" >
            <a href = "${packageObj.url}" target = "_blank" >
            <div ><img alt = "${packageObj.subreddit_loc} – ${packageObj.title}"
          src = "${packageObj.url}" >
            </div> </a> </div>`;

        } else {
          postText = `<a href="${packageObj.url}">${packageObj.url}</a>`
        }
      }
      // postText = packageObj.body ? `<p>${packageObj.body}</p>` : mdToHtml( packageObj.selftext )

      res.render("post", {
        /*  title: packageObj.subreddit.display_name , 
      subr: packageObj.subreddit.display_name ,  */
        title: `${subr_lang} – ${packageObj.title.substr(0, 65-subr_lang.length)} 💡`,
        keywords: `${subr_lang}, идея, контент, материал, для, написания, статья, журнал, журналистика, газета, дзен, блог`,
        subr: `<a href="/r/${packageObj.subreddit.display_name}">${subr_lang}</a>`,
        subrEmoji: getEmoji(req.params.subreddit),
        postHeader: packageObj.title,
        description: packageObj.postDescription ? packageObj.postDescription + " " + slogan : packageObj.title + " " + slogan,
        // postImg: postImg,
        postText: postText,
        soc: yandexBar,

        //postText: packageObj.body ? `<p>${packageObj.body}</p>` : packageObj.selftext,

        postScore: packageObj.ups,
        postAuthor: packageObj.author.name,
        postDatetime: moment(postDatetime).format("lll"),
        expand: comments,
        apxub: apxub,
        email: 'mailto:' + email,
        toggleDarkTheme: toggleDarkTheme,
      });
    })
    .catch(err => {
      console.error(err);
    });
});

let mdToHtml = (mdText) => {
  return markdowner.makeHtml(
      mdText
      .replace('\n', '  ')
      .replace(/\*\*\s/g, '**')
      .replace(/\s\*\*/g, '**')
      //.replace(/\*\s/g, '*')
      //.replace(/\s\*/g, '*')
      .replace(/__\s/g, '__')
      .replace(/\s__/g, '__')
      .replace(/\[(.{2,128})\]\s\((.*?)\)/g, (...g) => `[${g[1]}] (${g[2].replace(/\s+/g, '')})`)
      .replace(/\[(.{2,128})\]\((.*?)\)/g, (...g) => `[${g[1]}] (${g[2].replace(/\s+/g, '')})`)
    )
    .replace(/&nbsp;/g, '  ')
    .replace(/\&amp\;\s\#\sX200B\;/g, '  ')
    .replace(/(<a[^>]*)(>)([^<]+)(<\/a>)/g, (match, p1, p2, p3, p4, offset, string) => [p1, ` rel="nofollow" `, p2, p3, p4].join(''))

}

module.exports = router;