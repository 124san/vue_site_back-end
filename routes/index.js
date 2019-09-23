var express = require('express');
var router = express.Router();

// For passwd hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Im gonna say the n word!' });
});

/* GET Userlist page sql.
router.get('/userlist', function(req, res) {
  var connection = req.db;
  connection.query('SELECT * FROM usercollection', function(err, rows, fields) {
    if (err) throw err;
    res.render('userlist', {
        "userlist" : rows,
    });
  });
});*/

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

module.exports = router;
