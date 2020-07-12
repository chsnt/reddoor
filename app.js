const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon')
const fse = require('fs-extra')


const sitemap = require('express-sitemap-xml')

// const forceSsl = require('express-force-ssl');

const indexRouter = require('./routes/index');
//const mainRouter = require('./routes/main');

const app = express();

// sitemap

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// if (process.env.NODE_ENV === 'prod') app.use(forceSsl);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))

app.use('/', indexRouter);
app.get('/robots.txt', function (req, res) {
  const robots = require('./funcs/robotstxt.js')

  res.type('text/plain');
  res.send(`User-agent: *\n${robots()}\nSitemap: https://apxub.com/sitemap.xml`);
});
// console.log(getUrls())
// const sitemapGenerator = require('./sitemapGenerator')
// sitemapGenerator()
app.use(sitemap(() => fse.readJson('sitemap.json'), 'https://apxub.com'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;