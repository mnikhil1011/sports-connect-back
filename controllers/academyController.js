const academyModel=require('../models/academyModel')

const createAcademy=async (req,res)=>{
  const {name,sport,quantity}=req.body;
  const cID=req.cID
  console.log("here");
  console.log({name,sport,quantity,cID})

  const acad=await academyModel.findOne({name:name});
  if(acad)
  {
    return res.status(400).json({error:"this academy already exists"});
  }
  
  const academy=await academyModel.create({name,sport,quantity,cID})
  return res.status(200).json(academy);
}

const updateQuantity=async(req,res)=>{
  const {name,quantity}=req.body
  const acad=await academyModel.findOneAndUpdate({name},{$set:{quantity}});
  if(acad)
  {
    return  res.status(200).json(acad);
  }
  return res.status(400).json({error:"this academy doesnt exists"});
}
const deleteAcademy=async(req,res)=>{
  const {name}=req.body
  const acad=await academyModel.findOneAndDelete({name});
  if(acad)
  {
    return  res.status(200).json(academy);
  }
  return res.status(400).json({error:"this academy doesnt exist"});
}

const allCoach= async(req,res)=>{
  const acads=await academyModel.find({cID:req.cID})
  return res.status(200).json(acads);
}

const allAcademys= async(req,res)=>{
  const acads=await academyModel.find()
  return res.status(200).json(acads); 
}

const getdetails=async(req,res)=>{
  console.log("hi");
  const name=req.params.name;
  const acad=await academyModel.findOne({name});
  console.log(name, acad)
  return res.status(200).json(acad);
}

const academybySport= async(req,res)=>{
  const sport=req.params.sport;
  const acads=await academyModel.find({sport})
  return res.status(200).json(acads); 
}

module.exports={
  createAcademy,
  updateQuantity,
  deleteAcademy,
  allCoach,
  allAcademys,
  getdetails,
  academybySport
}