const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');
const coachModel = require('../models/coachModel');
const playerModel = require('../models/playerModel');
const playerPostModel = require('../models/playerPostModel');
const coachPostModel = require('../models/coachPostModel');

const login = async (req, res) => {
  const { emailID, password } = req.body;
  try {
    admin = await adminModel.login(emailID, password);
    if (!admin) {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  // const token = createToken(player._id);
  // res.cookie('playerid', token, { httpOnly: true, maxAge: maxAge * 1000 });
  // res.status(200).json(token);

  const token = createToken(admin._id);
  console.log('token', token);

  res.status(200).json({ token });
};
const getTotalUsersCount = async (req, res) => {
  try {
    const playerCount = await playerModel.countDocuments();
    const coachCount = await coachModel.countDocuments();

    const TotalCount = playerCount + coachCount;
    res.status(200).json(TotalCount);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching player information:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getPlayersCount = async (req, res) => {
  try {
    const playerCount = await playerModel.countDocuments();

    res.status(200).json(playerCount);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching player information:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const getCoachesCount = async (req, res) => {
  try {
    const coachesCount = await coachModel.countDocuments();

    res.status(200).json(coachesCount);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching player information:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const getPlayerSportsCount = async (req, res) => {
  try {
    const sportsCount = await playerModel.aggregate([
      { $unwind: '$gaming_statistics' }, // Unwind the gaming_statistics array
      { $group: { _id: '$gaming_statistics.sport', count: { $sum: 1 } } }, // Group by sport and count
    ]);

    // Create an object to store merged counts
    const mergedCounts = {};
    sportsCount.forEach((sport) => {
      const sportName = sport._id.toLowerCase(); // Convert sport name to lowercase for case-insensitivity
      if (mergedCounts[sportName]) {
        mergedCounts[sportName].count += sport.count;
      } else {
        mergedCounts[sportName] = { _id: sport._id, count: sport.count };
      }
    });

    // Convert merged counts object to array
    const mergedCountsArray = Object.values(mergedCounts);

    res.status(200).json(mergedCountsArray);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching player information:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getCoachSportsCount = async (req, res) => {
  try {
    const sportsCount = await coachModel.aggregate([
      { $unwind: '$sports_expertise' }, // Unwind the gaming_statistics array
      { $group: { _id: '$sports_expertise.sport', count: { $sum: 1 } } }, // Group by sport and count
    ]);

    // Create an object to store merged counts
    const mergedCounts = {};
    sportsCount.forEach((sport) => {
      const sportName = sport._id.toLowerCase(); // Convert sport name to lowercase for case-insensitivity
      if (mergedCounts[sportName]) {
        mergedCounts[sportName].count += sport.count;
      } else {
        mergedCounts[sportName] = { _id: sport._id, count: sport.count };
      }
    });

    // Convert merged counts object to array
    const mergedCountsArray = Object.values(mergedCounts);

    res.status(200).json(mergedCountsArray);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching player information:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getTopTenUsers = async (req, res) => {
  try {
    const latestCoaches = await coachModel
      .find({}, { name: 1, emailID: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(10);

    const latestPlayers = await playerModel
      .find({}, { name: 1, emailID: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(10);

    const combinedLatestUsers = [...latestCoaches, ...latestPlayers];

    combinedLatestUsers.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Return top 10 latest users
    const data = combinedLatestUsers
      .slice(0, 10)
      .map((user) => ({ name: user.name, emailID: user.emailID }));
    return res.status(200).json(data);
  } catch (error) {
    // Handle error
    console.error(error);
    return res.status(500).json({ error: 'Error fetching latest users' });
  }
};

const getActivePlayersCount = async (req, res) => {
  try {
    const activeUsersCount = await playerModel.countDocuments({
      isBlocked: false,
    });
    return res.status(200).json(activeUsersCount);
  } catch (error) {
    console.error('Error fetching player information:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getActiveCoachesCount = async (req, res) => {
  try {
    const activeCoachesCount = await coachModel.countDocuments({
      isBlocked: false,
    });
    return res.status(200).json(activeCoachesCount);
  } catch (error) {
    console.error('Error fetching player information:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const getActiveUsersCount = async (req, res) => {
  try {
    const activeCoachesCount = await coachModel.countDocuments({
      isBlocked: false,
    });
    const activePlayersCount = await playerModel.countDocuments({
      isBlocked: false,
    });
    const total = activeCoachesCount + activePlayersCount;
    console.log(total);
    return res.status(200).json(total);
  } catch (error) {
    console.error('Error fetching toal active users count', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllPlayersList = async (req, res) => {
  try {
    // Retrieve all players from the database
    const players = await playerModel
      .find({}, '_id name emailID isBlocked createdAt')
      .sort({ createdAt: -1 });

    // If there are no players, return an empty array
    if (!players) {
      return [];
    }
    // console.log(players);
    // Map the players to include only the required fields and return the result as an array
    const finalPlayers = players.map((player) => ({
      id: player._id,
      name: player.name,
      email: player.emailID,
      isBlocked: player.isBlocked,
    }));
    // console.log(finalPlayers);
    res.status(200).json(finalPlayers);
  } catch (error) {
    // Handle errors
    console.error(error);
    throw new Error('Error retrieving players');
  }
};

const getAllCoachesList = async (req, res) => {
  try {
    // Retrieve all coaches from the database
    const coaches = await coachModel
      .find({}, '_id name emailID isBlocked createdAt')
      .sort({ createdAt: -1 });

    // If there are no coaches, return an empty array
    if (!coaches) {
      return [];
    }

    // Map the coaches to include only the required fields and return the result as an array
    const finalCoaches = coaches.map((coach) => ({
      id: coach._id,
      name: coach.name,
      email: coach.emailID,
      isBlocked: coach.isBlocked,
    }));
    res.status(200).json(finalCoaches);
  } catch (error) {
    // Handle errors
    console.error(error);
    throw new Error('Error retrieving coaches');
  }
};

const blockCoach = async (req, res) => {
  try {
    const { coachID } = req.body;

    console.log('coach ka backend id', coachID);
    if (!coachID) {
      throw new Error('Coach ID could not be found');
    }

    const coach = await coachModel.findById(coachID);

    if (!coach) {
      throw new Error('Coach not found');
    }

    coach.isBlocked = true;

    await coach.save();

    res.status(200).send(coach); // Return the updated coach
  } catch (error) {
    throw new Error(`Failed to block coach:' ${error.message}`);
  }
};

const unblockCoach = async (req, res) => {
  try {
    const { coachID } = req.body;

    console.log('coach ka backend id', coachID);
    if (!coachID) {
      throw new Error('Coach ID could not be found');
    }

    const coach = await coachModel.findById(coachID);

    if (!coach) {
      throw new Error('Coach not found');
    }

    coach.isBlocked = false;

    await coach.save();

    res.status(200).send(coach); // Return the updated coach
  } catch (error) {
    throw new Error(`Failed to block coach:' ${error.message}`);
  }
};

const blockPlayer = async (req, res) => {
  try {
    const { playerID } = req.body;
    console.log('backend ka player id :', playerID);
    if (!playerID) {
      throw new Error('player ID could not be found');
    }

    const player = await playerModel.findById(playerID);
    console.log('player backend', player);

    if (!player) {
      throw new Error('player not found');
    }

    player.isBlocked = true;

    await player.save();

    res.status(200).send(player); // Return the updated coach
  } catch (error) {
    throw new Error(`Failed to block player:' ${error.message}`);
  }
};

const unblockPlayer = async (req, res) => {
  try {
    const { playerID } = req.body;
    console.log('backend ka player id :', playerID);
    if (!playerID) {
      throw new Error('player ID could not be found');
    }

    const player = await playerModel.findById(playerID);

    if (!player) {
      throw new Error('player not found');
    }

    player.isBlocked = false;

    await player.save();

    res.status(200).send(player); // Return the updated coach
  } catch (error) {
    throw new Error(`Failed to block player:' ${error.message}`);
  }
};

const getCoachesJoinedPerMonth = async (req, res) => {
  try {
    const data = await coachModel.aggregate([
      {
        $match: { createdAt: { $exists: true } }, // Filter out documents without createdAt field
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          Coaches: '$count',
        },
      },
      {
        $sort: { month: 1 },
      },
      {
        $project: {
          name: {
            $switch: {
              branches: [
                { case: { $eq: ['$month', 1] }, then: 'January' },
                { case: { $eq: ['$month', 2] }, then: 'February' },
                { case: { $eq: ['$month', 3] }, then: 'March' },
                { case: { $eq: ['$month', 4] }, then: 'April' },
                { case: { $eq: ['$month', 5] }, then: 'May' },
                { case: { $eq: ['$month', 6] }, then: 'June' },
                { case: { $eq: ['$month', 7] }, then: 'July' },
                { case: { $eq: ['$month', 8] }, then: 'August' },
                { case: { $eq: ['$month', 9] }, then: 'September' },
                { case: { $eq: ['$month', 10] }, then: 'October' },
                { case: { $eq: ['$month', 11] }, then: 'November' },
                { case: { $eq: ['$month', 12] }, then: 'December' },
              ],
              default: 'Unknown',
            },
          },
          Coaches: 1,
        },
      },
    ]);

    // Wrap data inside an array
    const dataArray = Array.isArray(data) ? data : [data];

    console.log('coach data ka type backend', typeof dataArray);
    res.status(200).json(dataArray);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getPlayersJoinedPerMonth = async (req, res) => {
  try {
    const data = await playerModel.aggregate([
      {
        $match: { createdAt: { $exists: true } }, // Filter out documents without createdAt field
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
          },
          Players: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          Players: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
      {
        $project: {
          name: {
            $switch: {
              branches: [
                { case: { $eq: ['$month', 1] }, then: 'January' },
                { case: { $eq: ['$month', 2] }, then: 'February' },
                { case: { $eq: ['$month', 3] }, then: 'March' },
                { case: { $eq: ['$month', 4] }, then: 'April' },
                { case: { $eq: ['$month', 5] }, then: 'May' },
                { case: { $eq: ['$month', 6] }, then: 'June' },
                { case: { $eq: ['$month', 7] }, then: 'July' },
                { case: { $eq: ['$month', 8] }, then: 'August' },
                { case: { $eq: ['$month', 9] }, then: 'September' },
                { case: { $eq: ['$month', 10] }, then: 'October' },
                { case: { $eq: ['$month', 11] }, then: 'November' },
                { case: { $eq: ['$month', 12] }, then: 'December' },
              ],
              default: 'Unknown',
            },
          },
          Players: 1,
        },
      },
    ]);
    console.log('player data ka type backend', typeof data);

    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const getPlayerPostDetails = async (req, res) => {
  try {
    // Aggregate pipeline to count the elements in requests, accepted, and rejected arrays
    const aggregationPipeline = [
      {
        $project: {
          acceptedCount: { $size: '$accepted' },
          rejectedCount: { $size: '$Rejected' },
          pendingCount: {
            $subtract: [
              { $size: '$requests' },
              { $add: [{ $size: '$accepted' }, { $size: '$Rejected' }] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          accepted: { $sum: '$acceptedCount' },
          rejected: { $sum: '$rejectedCount' },
          pending: { $sum: '$pendingCount' },
        },
      },
      {
        $project: {
          _id: 0,
          data: [
            { name: 'Accepted', value: '$accepted' },
            { name: 'Rejected', value: '$rejected' },
            { name: 'Pending', value: '$pending' },
          ],
        },
      },
    ];

    // Execute aggregation pipeline
    const result = await playerPostModel.aggregate(aggregationPipeline);

    console.log(result[0].data);
    res.status(200).json(result[0].data);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const getCoachPostDetails = async (req, res) => {
  try {
    // Aggregate pipeline to count the elements in requests, accepted, and rejected arrays
    const aggregationPipeline = [
      {
        $project: {
          acceptedCount: { $size: '$accepted' },
          rejectedCount: { $size: '$Rejected' },
          pendingCount: {
            $subtract: [
              { $size: '$requests' },
              { $add: [{ $size: '$accepted' }, { $size: '$Rejected' }] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          accepted: { $sum: '$acceptedCount' },
          rejected: { $sum: '$rejectedCount' },
          pending: { $sum: '$pendingCount' },
        },
      },
      {
        $project: {
          _id: 0,
          data: [
            { name: 'Accepted', value: '$accepted' },
            { name: 'Rejected', value: '$rejected' },
            { name: 'Pending', value: '$pending' },
          ],
        },
      },
    ];

    // Execute aggregation pipeline
    const result = await coachPostModel.aggregate(aggregationPipeline);

    console.log(result[0].data);
    res.status(200).json(result[0].data);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const getPlayerCoachCountsBySport = async (req, res) => {
  try {
    const playerCounts = await playerModel.aggregate([
      { $unwind: '$gaming_statistics' },
      {
        $group: {
          _id: '$gaming_statistics.sport',
          count: { $sum: 1 },
        },
      },
    ]);

    const coachCounts = await coachModel.aggregate([
      { $group: { _id: '$sport', count: { $sum: 1 } } },
    ]);

    // Merge player and coach counts by sport
    const mergedCounts = [];
    playerCounts.forEach((playerCount) => {
      const coachCount = coachCounts.find(
        (coachCount) => coachCount._id === playerCount._id
      );
      mergedCounts.push({
        subject: playerCount._id,
        A: playerCount.count,
        B: coachCount ? coachCount.count : 0,
      });
    });

    coachCounts.forEach((coachCount) => {
      if (!mergedCounts.find((item) => item.subject === coachCount._id)) {
        mergedCounts.push({
          subject: coachCount._id,
          A: 0,
          B: coachCount.count,
        });
      }
    });

    console.log(mergedCounts);
    res.status(200).json(mergedCounts);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

module.exports = {
  login,
  getTotalUsersCount,
  getPlayersCount,
  getCoachesCount,
  getPlayerSportsCount,
  getCoachSportsCount,
  getTopTenUsers,
  getActivePlayersCount,
  getActiveCoachesCount,
  getAllPlayersList,
  getAllCoachesList,
  blockCoach,
  blockPlayer,
  unblockPlayer,
  unblockCoach,
  getCoachesJoinedPerMonth,
  getPlayersJoinedPerMonth,
  getActiveUsersCount,
  getPlayerPostDetails,
  getCoachPostDetails,
  getPlayerCoachCountsBySport,
};
