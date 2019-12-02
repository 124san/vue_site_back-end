var express = require('express');
var router = express.Router();
const User = require('../models/user')
const authMiddleware = require('../middlewares/auth_middleware')

// GET to check current logged in user
router.get('/current', authMiddleware,(req, res) => {
  User.findById(req.session.passport.user, (err, user) => {
    if (err) return res.status(500).send(err)
    return res.send(user)
  })
})

// GET to check user with id
router.get('/:id', authMiddleware,(req, res) => {
  var id = req.params.id
  User.findById(id, (err, user) => {
    if (err) return res.status(500).send(err)
    return res.send(user)
  })
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// PUT update a user
router.put('/update-description/:id', function(req, res) {
  var id = req.params.id
  User.findByIdAndUpdate(id, req.body, {new: true}, (err, user) => {
    if (err) return res.status(500).send(err)
    return res.send(user)
  })
});
module.exports = router;
