const coachModel = require('../models/coachModel');
const playerModel = require('../models/playerModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60; //3 days
createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT, {
    expiresIn: maxAge,
  });
};

const signup = async (req, res) => {
  try {
    const {
      name,
      emailID,
      password,
      mobileNumber,
      sport,
      coaching_experience_years,
      certifications,
    } = req.body;
    // console.log(emailID);
    // console.log(password);
    // Check if coach with the same email already exists
    const existingCoach = await coachModel.findOne({ emailID });
    const existingplayer = await playerModel.findOne({ emailID });
    if (existingCoach) {
      console.log('Coach already exists');
      return res
        .status(400)
        .json({ error: 'Mail already exists for another coach' });
    }
    if (existingplayer) {
      console.log('Player already exists');
      return res.status(400).json({ error: 'Mail already exists for player' });
    }

    // Create a new coach document with sports expertise
    const coach = await coachModel.create({
      name,
      emailID,
      password,
      mobileNumber,
      sport,
      coaching_experience_years,
      certifications,
      // Add more fields as needed
    });

    // Generate token
    const token = createToken(coach._id);

    // Respond with token
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { emailID, password } = req.body;
  try {
    coach = await coachModel.login(emailID, password);
    console.log(coach);
    if (coach && coach.isBlocked) {
      return res.status(400).json({
        error:
          'Your account is blocked by admin. Please contact admin to unblock your account',
      });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  console.log(`ss`);
  const token = createToken(coach._id);

  // res.cookie('coachid', token, { httpOnly: true, maxAge: maxAge * 1000 });
  res.status(200).json({ token });
};

//we set lifetime to 1 ms so it goes
const logout = async (req, res) => {
  console.log('okkk');
  res.cookie('coachid', '', { maxAge: 1 });
  return res.status(200).json('');
};

const all_applied_Student = async (req, res) => {
  // const posts = await playerPostModel.find();
  try {
    const coachId = req.coachid;
    const coach = await coachModel.findById(coachId);

    // If coach not found
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    const appliedStudents = coach.applied_students;
    // Fetch all posts excluding those created by the player
    // console.log(appliedStudents);
    return res.status(200).json(appliedStudents);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
const fetch_player_info = async (req, res) => {
  try {
    const coachId = req.coachid;
    const playerID = req.params._id;
    const player = await playerModel.findById(playerID);
    // Extract the name and general information from the player object
    const { name, emailID, mobileNumber, location } = player;

    // Create a new object containing only the name and general information
    const playerInfo = {
      name,
      emailID,
      mobileNumber,
      location,
    };

    // Return the player's name and general information as JSON response
    res.status(200).json(playerInfo);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching player information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const profile = async (req, res) => {
  try {
    const coachId = req.coachid;
    const coach = await coachModel.findById(coachId);

    if (!coach) return res.status(404).json({ error: 'Player not found' });

    res.status(200).json(coach);
  } catch (error) {
    console.error('Error fetching player profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const updateProfile = async (req, res) => {
  try {
    const coachId = req.coachid;
    let coach = await coachModel.findById(coachId);
    // console.log(player);
    if (!coach) {
      return res.status(404).json({ error: 'Player not found' });
    }
    console.log(req);
    console.log(`coach`, coach);
    const { emailID, password, ...updatedData } = req.body;

    coach.set(updatedData);

    coach = await coach.save();
    console.log(`coach after`, coach);
    // console.log(coach);
    res.status(200).json(coach);
  } catch (error) {
    console.error('Error updating player profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {
  signup,
  login,
  logout,
  all_applied_Student,
  fetch_player_info,
  profile,
  updateProfile,
};
