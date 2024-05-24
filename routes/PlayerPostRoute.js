const express = require('express');
const router = express.Router();

//middleware
const { playermiddle } = require('../middleware/playerMiddleware');

const {
  createPlayerPost,
  deletePlayerPost,
  allPlayerPost,
  allPlayerPosts,
  getdetails,
  playerPostbySport,
  requestonpost,
  Statusonpost,
  Getrequestonpost,
  POSTAccept,
  getpostsbyids,
  POSTREJECT,
  requestoncoachpost,
  RecentActivity,
} = require('../controllers/playerPostController');

router.use(
  [
    '/delete',

    '/create',
    '/allplayerpost',
    '/allplayerposts',
    '/requestonpost',
    '/Statusonpost',
    '/Getrequestonpost ',
    '/POSTAccept',
    '/POSTREJECT',
    '/getpostsbyids',
    '/requestoncoachpost',
    '/recent',
  ],
  playermiddle
);
router.post('/getpostsbyids', getpostsbyids);
router.get('/Statusonpost/:_id', Statusonpost);
router.post('/requestonpost/:_id', requestonpost);
router.delete('/delete', deletePlayerPost);

router.post('/create', createPlayerPost);
router.post('/POSTAccept', POSTAccept);
router.post('/POSTREJECT', POSTREJECT);
router.get('/allplayerpost', allPlayerPost);
router.get('/allplayerposts', allPlayerPosts);
router.get('/details/:_id', getdetails);
router.get('/Getrequestonpost/:_id', Getrequestonpost);
router.get('/sport/:sport', playerPostbySport);

router.post('/requestoncoachpost/:_id', requestoncoachpost);

router.get('/recent', RecentActivity);
module.exports = router;
