const jwt = require('jsonwebtoken');

const adminmiddle = (req, res, next) => {
  
  const token = req.header('Authorization');
  console.log('here ', token);

 

  if (!token) {
    return res.status(401).json({ error: 'no token present' });
  }

  jwt.verify(token, process.env.JWT, (err, adminid) => {
    if (err) {
      return res.status(401).json({ error: 'wrong token present' });
    }
    console.log(adminid);
    req.adminid = adminid.id;
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
  adminmiddle,
};
