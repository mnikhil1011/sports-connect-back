const express = require('express');
const router = express.Router();

const { coachmiddle } = require('../middleware/coachMiddleware');

const {
  createcoachPost,
  coachselfpost,
  deletecoachPost,
  Getrequestonpost,
  POSTAccept,
  POSTREJECT,
  // allcoachPosts,
} = require('../controllers/coachPostController');

router.use(
  [
    '/create',
    '/allselfpost',
    '/delete',
    '/requestoncoachpost',
    '/POSTAccept',
    '/POSTREJECT',
  ],
  coachmiddle
);
router.delete('/delete', deletecoachPost);
router.post('/create', createcoachPost);
router.get('/allselfpost', coachselfpost);
// router.get('/allcoachposts', allcoachPosts);
router.get('/Getrequestonpost/:_id', Getrequestonpost);
router.post('/POSTAccept', POSTAccept);
router.post('/POSTREJECT', POSTREJECT);

module.exports = router;
