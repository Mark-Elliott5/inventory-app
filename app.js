const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const compression = require('compression');
const helmet = require('helmet');

const app = express();

// // Set up rate limiter: maximum of twenty requests per minute
// const RateLimit = require('express-rate-limit');

// const limiter = RateLimit({
//   windowMs: 1 * 10 * 1000, // 10 seconds
//   max: 10,
// });
// // Apply rate limiter to all requests
// app.use(limiter);

// Set up mongoose connection
const mongoose = require('mongoose');
const categoryRouter = require('./routes/categories');
const productsRouter = require('./routes/products');
const indexRouter = require('./routes/index');

mongoose.set('strictQuery', false);

const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
console.log('Views directory:', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'script-src': ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net'],
    },
  })
);

app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/category', categoryRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
