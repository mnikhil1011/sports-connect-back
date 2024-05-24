const express=require('express')
const router=express.Router();

//middleware
const {
  coachmiddle,
  playermiddle
}=require('../middleware/academyMiddleware')

const {
  createAcademy,
  updateQuantity,
  deleteAcademy,
  allCoach,
  allAcademys,
  getdetails,
  academybySport
} =require('../controllers/academyController');

 


router.use(['/delete','/updatequantity','/create','/allcoach'],coachmiddle)

router.delete('/delete',deleteAcademy)
router.patch('/updatequantity',updateQuantity)
router.post('/create',createAcademy);
router.get('/allcoach',allCoach)

router.use(['/allacademys'],playermiddle)
router.get('/allacademys',allAcademys);

router.get('/details/:name',getdetails)
router.get('/sport/:sport',academybySport)

module.exports=router;