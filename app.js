var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const cookieSession = require('cookie-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require("./models/user")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1)
// ---------- Cors --------

var origin = process.env.ALLOWED_ORIGIN || 'http://localhost:8080'
app.use(cors({origin: origin, credentials: true}))

app.use(cookieSession({
  name: 'mysession',
  keys: [process.env.SESSION_KEY || 'akey'],
  httpOnly: true,
  secure: false,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
// ---------------------- Passport ---------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      user.comparePassword(password, (err, result) => {
        if (err) return done(err)
        if (!result) {
          return done(null, false)
        }
        return done(null, user)
      })
    })
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

app.use(bodyParser.json())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// config db
require('./config/db');

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
