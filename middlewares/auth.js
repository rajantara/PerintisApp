const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies['access_token'];

    if (!token) {
      return res.redirect('/auth/login');
    }

    const decoded = jwt.verify(
      token,
      'ksAdskj5ApsUjD6pjj7gg67pbt6t6FgGhSbFBpb7F9v57GyeDe1FSqYqAF539dDWp7F8FpSfi6'
    );

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.clearCookie('access_token').redirect('/auth/login');
  }
};
