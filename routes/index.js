var express = require('express');
var router = express.Router();

const User = require('../models/user')

/* GET home page 2021. */  
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find()
      .select('username role')
      .sort({ date: 'desc' });

    if (!users) {
      return res.render('akunUser/akunUser', { users: [], msg: '' });
    }
    res.render('akunUser/akunUser', { users, msg: '', loginUser: req.user });
  } catch (err) {
    console.error(err.message)
  }
});

module.exports = router;
