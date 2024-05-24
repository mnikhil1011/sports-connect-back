const express = require('express');
const router = express.Router();

const { coachmiddle } = require('../middleware/coachMiddleware');

const {
  signup,
  login,
  logout,
  all_applied_Student,
  fetch_player_info,
  profile,
  updateProfile,
} = require('../controllers/coachController');
router.use(
  ['/applied/students', '/fetch_player_info', '/updateProfile', '/profile'],
  coachmiddle
);
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/fetch_player_info/:_id', fetch_player_info);
router.get('/applied/students', all_applied_Student);
router.get('/profile', profile);
router.put('/updateProfile', updateProfile);
module.exports = router;
