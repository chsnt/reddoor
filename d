[33mcommit a693d25b3f8b857e4e8fea4477c677cb2bbb4ee7[m[33m ([m[1;36mHEAD -> [m[1;32mmaster[m[33m, [m[1;31mheroku/master[m[33m)[m
Author: chsnt <43132492+chsnt@users.noreply.github.com>
Date:   Tue Jan 7 21:53:53 2020 +0300

    fix blockquote & postImg block

[1mdiff --git a/public/stylesheets/style.css b/public/stylesheets/style.css[m
[1mindex 4415024..4ee70e7 100644[m
[1m--- a/public/stylesheets/style.css[m
[1m+++ b/public/stylesheets/style.css[m
[36m@@ -270,8 +270,10 @@[m [mbody {[m
 [m
 blockquote {[m
   /*margins*/[m
[31m-  border-left: 3px solid lightgray;[m
[32m+[m[32m  border-left: 4px solid lightgray;[m
   margin-left: 10px;[m
[32m+[m[32m  padding-left: 10px;[m
[32m+[m
 }[m
 [m
 .similar {[m
[1mdiff --git a/routes/index.js b/routes/index.js[m
[1mindex 434b778..2a9ebdd 100644[m
[1m--- a/routes/index.js[m
[1m+++ b/routes/index.js[m
[36m@@ -94,11 +94,14 @@[m [mrouter.get('/r/:subreddit/:id', async function(req, res, next) {[m
       let arr = packageObj.url.split('.')[m
       [m
       if( imgs.indexOf(arr[arr.length-1])>-1 ) postImg = `[m
[31m-        <a href="${packageObj.url}" target="_blank">[m
[32m+[m[41m        [m
         <div class="postImg">[m
[31m-          <img alt="${packageObj.subreddit_loc} – ${packageObj.title}" src="${packageObj.url}">[m
[31m-        </div>[m
[31m-        </a>`[m
[32m+[m[32m          <a href="${packageObj.url}" target="_blank">[m
[32m+[m[32m            <div>[m
[32m+[m[32m            <img alt="${packageObj.subreddit_loc} – ${packageObj.title}" src="${packageObj.url}">[m
[32m+[m[32m            </div>[m
[32m+[m[32m          </a>[m
[32m+[m[32m        </div>`[m
 [m
     }[m
 [m
