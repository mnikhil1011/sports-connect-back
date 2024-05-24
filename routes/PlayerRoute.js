const express = require('express');
const router = express.Router();
const { coachmiddle } = require('../middleware/coachMiddleware');
const { playermiddle } = require('../middleware/playerMiddleware');

const { adminmiddle } = require('../middleware/adminMiddleware');
const {
  coachPost,
  allcoachPosts,
} = require('../controllers/coachPostController');
const {
  signup,
  login,
  logout,
  profile,
  updateProfile,
  applied,
  applytoacad,
  leaveacad,
  addtostarred,
  starred,
  removefromstarred,
  fetchPlayerInfo,
  check,
  please_tell_me_if_it_is_starred,
  fetch_coach_info,
  coach_applied,
  fetch_coach,

} = require('../controllers/playerController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

router.use(
  [
    '/applytoacad',
    '/applied',
    '/leaveacad',
    '/profile',
    '/addtostarred',
    '/starred',
    '/removefromstarred',
    '/updateProfile',
    '/fetchPlayerInfo',
    '/check',
    '/tellifstarred',
    '/fetch_coach_info',
    '/allcoachposts',
    '/coachpost',
    '/coach_applied',
    '/fetch_coach',
    
  ],
  playermiddle
);
router.get('/check', check);
router.get('/profile', profile);
router.get('/profile/info', fetchPlayerInfo);
router.put('/updateProfile', updateProfile);
router.post('/applytoacad', applytoacad);
router.get('/applied', applied);
router.delete('/leaveacad', leaveacad);

router.post('/addtostarred', addtostarred);
router.get('/starred', starred);
router.delete('/removefromstarred', removefromstarred);
router.get('/tellifstarred/:_id', please_tell_me_if_it_is_starred);

// coach

router.get('/fetch_coach_info/:_id', fetch_coach_info);
router.get('/fetch_coach/:_id', fetch_coach);
router.get('/coachpost/:_id', coachPost);
router.get('/allcoachposts', allcoachPosts);
router.get('/coach_applied', coach_applied);

module.exports = router;
