var express = require('express');
var router = express.Router();
const passport = require('passport')
const User = require('../models/user')

const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).send('You are not authenticated')
  } else {
    return next()
  }
}

// ---------------------- router functions ----------------------- //
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Im gonna say the n word!' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
  User.find({}, (err, users) => {
    if (err) throw err
    res.render('userlist', {
      "userlist" : users
    });
  })
});

/* POST to register */
router.post('/register', function(req, res) {

  // Get our form values. These rely on the "name" attributes
  User.findOne({email: req.body.email}, (err, user) => {
    if (err) throw err
    if (user) {
      return res.status(401).send("User exists")
    }
    var newUser = new User(req.body)
    newUser.save(err => {
      if (err) throw err
      passport.authenticate('local')(req, res, function () {
        res.send("registered")
      });
    })
  })
});

/* POST to login */
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      return res.status(400).send([user, "Cannot log in", info]);
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.send("Logged in");
    });
  })(req, res, next);
});
// GET to logout
router.get('/logout', (req, res) => {
  req.logout();
  return res.send();
})
// GET to check user
router.get('/user', authMiddleware,(req, res) => {
  User.findById(req.session.passport.user, (err, user) => {
    if (err) throw err
    return res.send(user)
  })
})

module.exports = router;
