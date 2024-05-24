const express = require('express');
const router = express.Router();

const { adminmiddle } = require('../middleware/adminMiddleware');

const {
  login,
  getTotalUsersCount,
  getCoachesCount,
  getPlayersCount,
  getPlayerSportsCount,
  getTopTenUsers,
  getActiveCoachesCount,
  getActivePlayersCount,
  getCoachSportsCount,
  getAllCoachesList,
  getAllPlayersList,
  blockCoach,
  blockPlayer,
  unblockCoach,
  unblockPlayer,
  getCoachesJoinedPerMonth,
  getPlayersJoinedPerMonth,
  getActiveUsersCount,
  getPlayerPostDetails,
  getCoachPostDetails,
  getPlayerCoachCountsBySport
} = require('../controllers/adminController');

router.use(
  [
    '/gettotaluserscount',
    '/getplayerscount',
    '/getcoachescount',
    '/getsportscount',
    '/gettoptenusers',
    '/getactiveplayerscount',
    '/getactivecoachescount', 
    '/getcoachsportscount',
    '/getallcoacheslistplease',
    '/getallplayerslist',
    '/blockcoach',
    '/blockplayer',
    '/unblockcoach',
    '/unblockplayer',
    '/getcoachesjoinedpermonth',
    '/getactiveuserscount',
    '/getplayerpostdetails',
    '/getcoachpostdetails',
    '/getplayercoachcountsbySport'

  
  ],
  adminmiddle
);


router.post('/login',login);
router.get('/gettotaluserscount',getTotalUsersCount);
router.get('/getcoachescount',getCoachesCount);
router.get('/getplayerscount',getPlayersCount);
router.get('/getsportscount',getPlayerSportsCount);
router.get('/getcoachsportscount',getCoachSportsCount);
router.get('/gettoptenusers',getTopTenUsers);
router.get('/getactiveplayerscount',getActivePlayersCount);
router.get('/getactivecoachescount',getActiveCoachesCount);
router.get('/getallcoacheslistplease',getAllCoachesList);
router.get('/getallplayerslist',getAllPlayersList);
router.put('/blockcoach',blockCoach);
router.put('/blockplayer',blockPlayer);
router.put('/unblockcoach',unblockCoach);
router.put('/unblockplayer',unblockPlayer);
router.get('/getcoachesjoinedpermonth',getCoachesJoinedPerMonth);
router.get('/getplayersjoinedpermonth',getPlayersJoinedPerMonth);
router.get('/getactiveuserscount',getActiveUsersCount);
router.get('/getplayerpostdetails',getPlayerPostDetails);
router.get('/getcoachpostdetails',getCoachPostDetails);
router.get('/getplayercoachcountsbySport',getPlayerCoachCountsBySport);


// router.get('/check', check);
// router.get('/profile', profile);
// router.get('/profile/info', fetchPlayerInfo);
// router.put('/updateProfile', updateProfile);
// router.post('/applytoacad', applytoacad);
// router.get('/applied', applied);
// router.delete('/leaveacad', leaveacad);

// router.post('/addtostarred', addtostarred);
// router.get('/starred', starred);
// router.delete('/removefromstarred', removefromstarred);
// router.get('/tellifstarred/:_id', please_tell_me_if_it_is_starred);

module.exports = router;
