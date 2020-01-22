var express = require('express');
var router = express.Router();
const User = require('../models/user')
const authMiddleware = require('../middlewares/auth_middleware')

// GET to check current logged in user
router.get('/current', authMiddleware, async (req, res) => {
  try {
    console.log(req.cookies)
    const user = await User.findById(req.session.passport.user)
    res.send(user)
  }
  catch (err) {
    res.status(500).send(err)
  }
})

// GET to check user with id
router.get('/:id', authMiddleware, async (req, res) => {
  var id = req.params.id
  const user = await User.findById(id)
  if (!user) return res.status(404).send("User not found")
  res.send(user)
})

/* GET users listing. */
router.get('/', authMiddleware, async (req, res, next) => {
  const users = await User.find();
  res.send(users)
});

// PUT update a user
router.put('/:id', async (req, res) => {
  var id = req.params.id
  const user = await User.findByIdAndUpdate(id, req.body, {new: true});
  if (!user) return res.status(404).send("User not found")
  res.send(user)
});
module.exports = router;
