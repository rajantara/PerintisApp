const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/auth');

const User = require('../models/user');

//@route GET akun-user
//@desc Show Akun User page
//@access Private

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('username role')
      .sort({ date: 'desc' });

    if (!users) {
      return res.render('akunUser/akunUser', { users: [], msg: '' });
    }
    res.render('akunUser/akunUser', { users, msg: '', loginUser: req.user });
  } catch (err) {
    console.error(err.message);
  }
});

//@route GET akun-user/tambah-user
//@desc Show tambah user page
//@access Private

router.get('/tambah-user', auth, (req, res) => {
  try {
    if (req.user.role !== 'GM') {
      return res.redirect('/akun-user');
    }

    res.render('akunUser/tambahUser', {
      loginUser: req.user,
      username: '',
      role: '',
      password: '',
      confirmPassword: '',
      msg: [],
    });
  } catch (err) {
    console.error(err.message);
  }
});

//@route POST akun-user/tambah-user
//@desc Register new user account
//@access Private

router.post('/tambah-user', auth, async (req, res) => {
  try {
    if (req.user.role !== 'GM') {
      return res.redirect('/akun-user');
    }
    let { username, role, password, confirmPassword } = req.body;

    username = username.toLowerCase();
    const msg = [];

    if (password === '') msg.push('Password tidak boleh kosong');
    if (confirmPassword === '')
      msg.push('Konfirmasi password tidak boleh kosong');
    if (username === '') msg.push('Username tidak boleh kosong');
    if (role === '') msg.push('Role tidak boleh kosong');

    if (msg.length > 0) {
      return res.render('akunUser/tambahUser', {
        loginUser: req.user,
        username,
        role,
        password,
        confirmPassword,
        msg,
      });
    }

    if (password.length < 6) {
      return res.render('akunUser/tambahUser', {
        loginUser: req.user,
        username,
        role,
        password,
        confirmPassword,
        msg: [...msg, 'Password minimal 6 karakter atau lebih'],
      });
    }

    if (password !== confirmPassword) {
      return res.render('akunUser/tambahUser', {
        loginUser: req.user,
        username,
        role,
        password,
        confirmPassword,
        msg: [...msg, 'Password tidak cocok'],
      });
    }

    let user = await User.findOne({ username });
    if (user) {
      return res.render('akunUser/tambahUser', {
        loginUser: req.user,
        username,
        role,
        password,
        confirmPassword,
        msg: [...msg, 'Akun dengan username ini sudah terdaftar'],
      });
    }

    user = new User({
      username,
      role,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.redirect('/akun-user');
  } catch (err) {
    console.error(err.message);
  }
});

//@route GET akun-user/:username
//@desc Show Edit user page
//@access Private

router.get('/:username', auth, async (req, res) => {
  try {
    if (req.user.role !== 'GM') {
      return res.redirect('/akun-user');
    }

    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.redirect('/akun-user');
    }

    const { username, role } = user;

    res.render('akunUser/editUser', {
      loginUser: req.user,
      username,
      role,
      password: '',
      confirmPassword: '',
      msg: [],
    });
  } catch (err) {
    console.error(err.message);
  }
});

//@route PUT akun-user/:username
//@desc Edit user
//@access Private

router.put('/:username', auth, async (req, res) => {
  try {
    if (req.user.role !== 'GM') {
      return res.redirect('/akun-user');
    }

    let { username, role, password, confirmPassword } = req.body;

    username = username.toLowerCase();
    const msg = [];

    if (password === '') msg.push('Password tidak boleh kosong');
    if (confirmPassword === '')
      msg.push('Konfirmasi password tidak boleh kosong');
    if (username === '') msg.push('Username tidak boleh kosong');
    if (role === '') msg.push('Role tidak boleh kosong');

    if (msg.length > 0) {
      return res.render('akunUser/editUser', {
        loginUser: req.user,
        username,
        role,
        password,
        confirmPassword,
        msg,
      });
    }

    if (password.length < 6) {
      return res.render('akunUser/editUser', {
        loginUser: req.user,
        username,
        role,
        password,
        confirmPassword,
        msg: [...msg, 'Password minimal 6 karakter atau lebih'],
      });
    }

    if (password !== confirmPassword) {
      return res.render('akunUser/editUser', {
        loginUser: req.user,
        username,
        role,
        password,
        confirmPassword,
        msg: [...msg, 'Password tidak cocok'],
      });
    }

    let newUser = await User.findOne({ username });

    if (newUser && username !== req.params.username) {
      return res.render('akunUser/editUser', {
        loginUser: req.user,
        username,
        role,
        password,
        confirmPassword,
        msg: [...msg, 'Akun dengan username ini sudah terdaftar'],
      });
    }

    const user = await User.findOne({ username: req.params.username });

    user.username = username;
    user.role = role;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.redirect('/akun-user');
  } catch (err) {
    console.error(err.message);
  }
});

//@route DELETE akun-user/:username
//@desc DELETE user
//@access Private

router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'GM') {
      return res.redirect('/akun-user');
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.redirect('/akun-user');
    }

    await User.findByIdAndRemove(req.params.id);

    res.redirect('/akun-user');
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
