const jwt = require('jsonwebtoken');

const coachmiddle = (req, res, next) => {
  const token = req.header('Authorization');
  console.log('here coach middle', token);
  if (!token) {
    return res.status(401).json({ error: 'no token present' });
  }
  jwt.verify(token, process.env.JWT, (err, coachid) => {
    if (err) {
      return res.status(401).json({ error: 'wrong token present' });
    }
    req.coachid = coachid.id;
    next();
  });
};

module.exports = {
  coachmiddle,
};
