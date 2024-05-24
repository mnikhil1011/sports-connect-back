const playerPostModel = require('../models/playerPostModel');
const coachModel = require('../models/coachModel');
const coachPostModel = require('../models/coachPostModel');
const playerModel = require('../models/playerModel');
const createPlayerPost = async (req, res) => {
  try {
    // Extract required fields from the request body
    const { title, description, sport, quantity, location, skill } = req.body;

    // Get the player's ID from the request
    const playerId = req.playerid;

    // Check if a player post with the same title already exists
    const existingPost = await playerPostModel.findOne({ title });
    if (existingPost) {
      return res
        .status(400)
        .json({ error: 'A player post with this title already exists' });
    }

    // Fetch the player's information directly within this function
    const player = await playerModel.findOne({ _id: playerId });
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Extract the name and general information from the player object
    const { name, emailID, mobileNumber, location: playerLocation } = player;

    // Construct the playerInfo object
    const playerInfo = {
      name,
      emailID,
      mobileNumber,
      playerLocation: playerLocation,
    };

    // Create the player post including playerInfo
    const playerPost = await playerPostModel.create({
      title,
      description,
      sport,
      quantity,
      location,
      createdBy: playerId,
      skill,
      playersInfo: [playerInfo], // Adding playerInfo to playersInfo array
    });

    // Return both the created player post and the player's information
    res.status(201).json({ playerPost });
  } catch (error) {
    console.error('Error creating player post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePlayerPost = async (req, res) => {
  const { _id, createdBy } = req.body;
  const playerId = req.playerid; // Assuming req.playerid contains the playerId

  // Check if createdby matches playerId
  if (createdBy !== playerId) {
    return res
      .status(403)
      .json({ error: 'You are not authorized to delete this post.' });
  }

  const acad = await playerPostModel.findOneAndDelete({ _id });
  if (acad) {
    return res.status(200).json(acad);
  }
  return res.status(400).json({ error: 'This player post does not exist.' });
};

const allPlayerPost = async (req, res) => {
  try {
    // Extract player ID from the request
    const playerId = req.playerid;

    // Find all player posts associated with the player ID
    const playerPosts = await playerPostModel.find({ createdBy: playerId });

    // Return the player posts in the response
    return res.status(200).json(playerPosts);
  } catch (error) {
    console.error('Error fetching player posts:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const allPlayerPosts = async (req, res) => {
  // const posts = await playerPostModel.find();
  const playerId = req.playerid;

  // Fetch all posts excluding those created by the player
  // const posts = await playerPostModel.find({ createdBy: { $ne: playerId } });
  const posts = await playerPostModel
    .find({ createdBy: { $ne: playerId } })
    .sort({ createdAt: -1 });
  return res.status(200).json(posts);
};

const getdetails = async (req, res) => {
  const _id = req.params._id;

  const post = await playerPostModel.findOne({ _id });
  // Log the retrieved post object

  return res.status(200).json(post);
};

// get all post by sending pids
// get all posts by sending post IDs
const getpostsbyids = async (req, res) => {
  try {
    // console.log(`hi`);
    const postIds = req.body.postIds; // Assuming postIds is an array of post IDs sent in the request body
    // console.log(postIds);
    // Find all posts whose _id is in the postIds array
    const posts = await playerPostModel.find({ _id: { $in: postIds } });

    // console.log(posts);
    // Return the array of posts in the response
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error retrieving posts by IDs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const playerPostbySport = async (req, res) => {
  const sport = req.params.sport;
  const post = await playerPostModel.find({ sport });
  return res.status(200).json(post);
};
// Post a request on a post
const requestonpost = async (req, res) => {
  try {
    // Extract required fields from the request body
    const { message } = req.body;

    const postId = req.params._id;
    const playerId = req.playerid;
    // Find the player post
    const post = await playerPostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const existingRequest = post.requests.find(
      (request) => request.playerId === playerId
    );

    if (existingRequest) {
      // If a request already exists for the playerId, send an error response
      return res.status(400).json({ error: 'Request already exists ' });
    }
    // Construct the request object
    const request = {
      playerId,
      message,
      status: 'pending', // Assuming the default status is pending
    };

    // Push the request to the post's requests array
    post.requests.push(request);

    // Save the updated post
    await post.save();

    res.status(201).json({ message: 'Request created successfully' });
  } catch (error) {
    console.error('Error in Request player post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// get all request for particular post
const Getrequestonpost = async (req, res) => {
  try {
    const playerId = req.playerid;
    const postId = req.params._id;
    // const { _id, createdBy } = req.body;
    // console.log(createdBy);
    // console.log(playerId);
    // Check if createdby matches playerId
    // if (createdBy !== playerId) {
    //   return res
    //     .status(403)
    //     .json({ error: 'You are not authorized to Get request ' });
    // }
    // Find the player post
    const post = await playerPostModel.findById(postId);
    console.log(post);
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

const Statusonpost = async (req, res) => {
  try {
    const playerId = req.playerid;
    const postId = req.params._id;

    const post = await playerPostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.requests.forEach((request) => {
      // console.log(request.playerId);
    });
    const existingRequest = post.requests.find(
      (request) => request.playerId === playerId
    );

    if (!existingRequest) {
      return res.status(404);
    }

    // Send the status of the existing request
    res.status(200).json({ status: existingRequest.status });
  } catch (error) {
    console.error('Error in Request player post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const POSTAccept = async (req, res) => {
  try {
    // console.log(playerId); //player who requested
    // console.log(playerId1); //player who posted and willl accept
    // console.log(`req:`, req);
    const { postId, playerId } = req.body;
    const playerId1 = req.playerid;
    // Find the post by postId
    const post = await playerPostModel.findById(postId);
    // Check if the post exists
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    // Check if the player who posted the request matches the player who posted the post
    if (post.createdBy !== playerId1) {
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
      }
    });
    // Save the updated post
    await post.save();
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
    const playerId1 = req.playerid;
    // Find the post by postId
    const post = await playerPostModel.findById(postId);
    // Check if the post exists
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    // Check if the player who posted the request matches the player who posted the post
    if (post.createdBy !== playerId1) {
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

const requestoncoachpost = async (req, res) => {
  try {
    // Extract required fields from the request body
    const { message, skill } = req.body;

    const coachpostId = req.params._id;
    const playerId = req.playerid;
    // Find the player post
    const post = await coachPostModel.findById(coachpostId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const existingRequest = post.requests.find(
      (request) => request.playerId === playerId
    );

    if (existingRequest) {
      // If a request already exists for the playerId, send an error response
      return res.status(400).json({ error: 'Request already exists ' });
    }
    // Construct the request object
    const request = {
      playerId,
      message,
      skill,
      status: 'pending', // Assuming the default status is pending
    };

    // Push the request to the post's requests array
    post.requests.push(request);

    // Save the updated post
    await post.save();

    res.status(201).json({ message: 'Request created successfully' });
  } catch (error) {
    console.error('Error in Request player post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const RecentActivity = async (req, res) => {
  try {
    const playerId = req.playerid;

    // Find all posts where the playerId matches playerId in requests
    const posts = await playerPostModel.find({ 'requests.playerId': playerId });

    // Initialize an empty array to store accepted and rejected requests
    let allRequests = [];

    // Iterate through each post
    for (const post of posts) {
      // Filter requests for the current post that are accepted or rejected and match playerId
      const playerRequests = post.requests.filter(
        (req) =>
          req.playerId === playerId &&
          (req.status === 'accepted' || req.status === 'rejected')
      );

      // Concatenate playerRequests with allRequests
      allRequests = allRequests.concat(
        playerRequests.map((request) => ({
          postId: post._id, // Extracting post ID from the current post
          status: request.status,
          message: request.message,
          timestamp: request.timestamp,
        }))
      );
    }

    // Sort all requests by timestamp in descending order
    allRequests.sort((a, b) => b.timestamp - a.timestamp);
    console.log(`allreq`, allRequests);
    // Get the latest 5 activities
    const latestActivities = allRequests.slice(0, 5);
    console.log(`Latest :::`, latestActivities);
    // Return the latest activities
    res.json(latestActivities);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createPlayerPost,
  Getrequestonpost,
  deletePlayerPost,
  allPlayerPost,
  allPlayerPosts,
  getdetails,
  playerPostbySport,
  requestonpost,
  Statusonpost,
  POSTAccept,
  getpostsbyids,
  POSTREJECT,
  requestoncoachpost,
  RecentActivity,
};
