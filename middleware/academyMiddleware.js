const jwt = require('jsonwebtoken');

const coachmiddle=(req,res,next)=>{
  const token=req.cookies.coachid;
  if(!token){
    return res.status(401).json({error:"no token present"})
  }
  jwt.verify(token,"mnikhil1011",(err,cID)=>{
    if(err){
      return res.status(401).json({error:"wrong token present"})
    }
    req.cID=cID.id;
    next();
  })
}

const playermiddle=(req,res,next)=>{
  const token=req.cookies.playerid;
  if(!token){
    return res.status(401).json({error:"no token present"})
  }
  jwt.verify(token,"mnikhil1011",(err,playerid)=>{
    if(err){
      return res.status(401).json({error:"wrong token present"})
    }
    req.playerid=playerid.id;
    next();
  })
}

module.exports={
  coachmiddle,
  playermiddle
}