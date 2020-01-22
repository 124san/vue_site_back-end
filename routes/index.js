var express = require('express');
var router = express.Router();
const passport = require('passport')
const User = require('../models/user')

// ---------------------- router functions ----------------------- //
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Userlist page. */
router.get('/userlist', async (req, res) => {
  const users = await User.find();
  res.render('userlist', {
    "userlist" : users
  });
})

/* POST to register */
router.post('/register', async (req, res) => {
  // Get our form values. These rely on the "name" attributes
  const user = await User.findOne({email: req.body.email})
  if (user) {
    return res.status(401).send("User exists")
  }
  var newUser = new User(req.body)
  await newUser.save()
  passport.authenticate('local')(req, res, function () {
    res.send("registered")
  });
});

/* POST to login */
router.post('/login', function(req, res, next) {
  console.log(req.cookies)
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

module.exports = router;
