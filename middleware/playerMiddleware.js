const jwt = require('jsonwebtoken');

const playermiddle = (req, res, next) => {
  // const token = req.headers.Authorization;
  // const { token } = req.headers;
  const token = req.header('Authorization');
  console.log('here ', token);

  // const token = req.header('auth-tokken');
  // console.log('middle', token);

  if (!token) {
    return res.status(401).json({ error: 'no token present' });
  }

  jwt.verify(token, process.env.JWT, (err, playerid) => {
    if (err) {
      return res.status(401).json({ error: 'wrong token present' });
    }
    console.log(playerid);
    req.playerid = playerid.id;
    next();
  });

  // jwt.verify(token, process.env.JWT, (err, playerid) => {
  //   if (err) {
  //     return res.status(401).json({ error: 'wrong token present' });
  //   }
  //   req.playerid = playerid.id;
  //   next();
  // });
};

module.exports = {
  playermiddle,
};
