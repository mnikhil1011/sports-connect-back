const coachModel = require('../models/coachModel');
const playerModel = require('../models/playerModel');
const coachPostModel = require('../models/coachPostModel');

const createcoachPost = async (req, res) => {
  try {
    // Extract required fields from the request body
    const { title, description, court, price, selectedSlot } = req.body;
    // Get the player's ID from the request
    // console.log(selectedSlot);
    const coachId = req.coachid;
    // Check if a player post with the same title already exists
    const existingPost = await coachPostModel.findOne({ title });
    if (existingPost) {
      // console.log(`201`);
      return res
        .status(400)
        .json({ error: 'A player post with this title already exists' });
    }
    // Create the player post including playerInfo
    const coachPost = await coachPostModel.create({
      title,
      description,
      court,
      price,
      selectedSlot,
      createdBy: coachId,
    });
    // console.log(`201ww`);
    res.status(201).json();
  } catch (error) {
    console.error('Error creating player post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const coachselfpost = async (req, res) => {
  try {
    // Extract player ID from the request
    const coachId = req.coachid;
    // Find all player posts associated with the player ID
    const coachPosts = await coachPostModel.find({ createdBy: coachId });

    // Return the player posts in the response
    return res.status(200).json(coachPosts);
  } catch (error) {
    console.error('Error fetching player posts:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const allcoachPosts = async (req, res) => {
  // const posts = await playerPostModel.find();
  const coachId = req.coachid;

  // Fetch all posts excluding those created by the player
  const posts = await coachPostModel.find();
  return res.status(200).json(posts);
};

const coachPost = async (req, res) => {
  // const posts = await playerPostModel.find();
  const coachId = req.coachid;
  const postId = req.params._id;
  // Fetch all posts excluding those created by the player
  const post = await coachPostModel.findById(postId);
  return res.status(200).json(post);
};
const deletecoachPost = async (req, res) => {
  const { _id, createdBy } = req.body;
  const coachId = req.coachid; // Assuming req.playerid contains the playerId

  // Check if createdby matches playerId
  if (createdBy !== coachId) {
    return res
      .status(403)
      .json({ error: 'You are not authorized to delete this post.' });
  }

  const acad = await coachPostModel.findOneAndDelete({ _id });
  if (acad) {
    return res.status(200).json(acad);
  }
  return res.status(400).json({ error: 'This player post does not exist.' });
};

// get all request for particular post
const Getrequestonpost = async (req, res) => {
  try {
    const coachId = req.coachid;
    // const postId = req.params._id;
    const postId = req.params._id;
    const post = await coachPostModel.findById(postId);
    // console.log(post);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Extract player IDs from requests
    const playerIds = post.requests.map((request) => request.playerId);

    // Fetch player information for each player ID
    const players = await playerModel.find({ _id: { $in: playerIds } });

    // Map player IDs to player information
    const playerInfoMap = {};
    players.forEach((player) => {
      playerInfoMap[player._id] = {
        name: player.name,
        emailID: player.emailID,
        mobileNumber: player.mobileNumber,
        social_media_links: player.social_interactions.social_media_links,
        feedback_and_ratings: player.feedback_and_ratings,
        // Add other fields as needed
      };
    });

    // Combine request data with player information
    const requestsWithPlayerInfo = post.requests.map((request) => ({
      postId: postId,
      playerId: request.playerId,
      playerInfo: playerInfoMap[request.playerId],
      message: request.message,
      skill: request.skill,
      timestamp: request.timestamp,
      status: request.status,
    }));
    console.log(requestsWithPlayerInfo);
    res.json(requestsWithPlayerInfo);
  } catch (error) {
    console.error('Error in Request player post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const POSTAccept = async (req, res) => {
  try {
    // console.log(playerId); //player who requested
    // console.log(playerId1); //player who posted and willl accept
    // consolelog;
    const { postId, playerId } = req.body;
    const coachId = req.coachid;
    // Find the post by postId
    const post = await coachPostModel.findById(postId);
    const coach = await coachModel.findById(coachId);
    // Check if the post exists
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    // Check if the player who posted the request matches the player who posted the post
    if (post.createdBy !== coachId) {
      return res
        .status(403)
        .json({ error: 'You are not authorized to accept this request' });
    }
    // Iterate through requests array
    post.requests.forEach((request) => {
      if (request.playerId === playerId) {
        // If the player is the one who posted the request, add it to accepted array and change status to 'accepted'
        request.timestamp = new Date();
        post.accepted.push({
          playerId: request.playerId,
          message: request.message,
          timestamp: new Date(),
        });
        request.status = 'accepted';
        coach.applied_students.push({
          player_id: request.playerId,
          skill: request.skill,
          postId: post._id,
          timestamp: new Date(),
        });
      }
    });
    // Save the updated post
    await post.save();
    await coach.save();
    console.log(`post:`, post);
    console.log(`coach:`, coach);
    const Accpost = post.accepted.map((accepted) => ({
      postId: postId,
      timestamp: accepted.timestamp,
    }));
    console.log(`acc`);
    console.log(Accpost);
    res.status(201).json(Accpost);
  } catch (error) {
    console.error('Error in accepting request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const POSTREJECT = async (req, res) => {
  try {
    // console.log(playerId); //player who requested
    // console.log(playerId1); //player who posted and willl accept
    const { postId, playerId } = req.body;
    const coachId = req.coachid;
    // Find the post by postId
    const post = await coachPostModel.findById(postId);
    // Check if the post exists
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    // Check if the player who posted the request matches the player who posted the post
    if (post.createdBy !== coachId) {
      return res
        .status(403)
        .json({ error: 'You are not authorized to accept this request' });
    }
    // Iterate through requests array
    post.requests.forEach((request) => {
      if (request.playerId === playerId) {
        // If the player is the one who posted the request, add it to accepted array and change status to 'accepted'
        request.timestamp = new Date();
        post.Rejected.push({
          playerId: request.playerId,
          timestamp: new Date(),
        });
        request.status = 'rejected';
      }
    });
    // Save the updated post
    await post.save();
    const reccpost = post.Rejected.map((Rejected) => ({
      postId: postId,

      timestamp: Rejected.timestamp,
    }));

    res.status(201).json(reccpost);
  } catch (error) {
    console.error('Error in accepting request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {
  createcoachPost,
  coachselfpost,
  allcoachPosts,
  coachPost,
  deletecoachPost,
  Getrequestonpost,
  POSTAccept,
  POSTREJECT,
};
