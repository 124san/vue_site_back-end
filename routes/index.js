var express = require('express');
var router = express.Router();

// For passwd hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
  var client = req.client;

  // connect to usercollection
  client.connect(err => {
    if (err) throw err;
    const collection = client.db("mynode").collection("usercollection");
    
    collection.find({}).toArray(function(e,docs){
      if (e) throw e;
      res.render('userlist', {
          "userlist" : docs
      });
    });
    client.close();
  });
});



/* POST to Add User Service */
router.post('/adduser', function(req, res) {

  // Set our internal client variable
  var client = req.client;

  // Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var userEmail = req.body.useremail;
  var password = req.body.password;

  // hash pw
  bcrypt.hash(password, saltRounds, (err, hashed) => {
    if (err) {
      throw err;
    }
    
    var newUser = { username: userName, email: userEmail, password: hashed}

    // connect to MongoDB
    client.connect(err => {
      if (err) throw err;
      const collection = client.db("mynode").collection("usercollection");
      
      collection.insert(newUser, function(e,docs){
        if (e) throw e;
        res.redirect("userlist");
      });
      client.close();
    });

  })
});

/* POST to login */
router.post('/login', function(req, res) {

  // Set our internal client variable
  var client = req.client;

  // Get our form values. These rely on the "name" attributes
  var loginUser = req.body.username;
  var loginPW = req.body.password;

  // connect to MongoDB
  client.connect(err => {
    if (err) throw err;
    const collection = client.db("mynode").collection("usercollection");
    
    // Find user with given credentials
    collection.findOne({username: loginUser}).then(result => {
      // if there is such user
      if (result) {
        bcrypt.compare(loginPW, result.password, (err, isCorrect) => {
          if (err) {
            res.status(500).send('error comparing pw');
          }
          // if password is correct
          if (isCorrect) {
            res.send(result)
          } else {
            res.status(403).send('nope, wrong pw')
          }
        })
      } else {
        res.status(403).send("Oof no such user")
      }
    }).catch(err => {
      res.status(500).send('error finding user')
    })
    client.close();
  });

});

module.exports = router;
