const mongoose = require('mongoose');

const playerPostSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },
  // quantity: {
  //   type: Number,
  //   required: true,
  // },
  // sport: {
  //   type: String,
  //   required: true,
  // },
  // pID: {
  //   type: String,
  //   required: true,
  // },

  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  sport: {
    type: String,
    required: true,
    // enum: ['Football', 'Basketball', 'Tennis', 'Cricket', 'Other'],
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  skill: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },

  createdBy: {
    ///PID
    ref: 'Player', // Assuming a Player model exists
    required: true,
    type: String,
    //   required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  requests: [
    {
      playerId: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
        trim: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
    },
  ],
  accepted: [
    {
      playerId: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
        trim: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  Rejected: [
    {
      playerId: {
        type: String,
        required: true,
      },

      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  playersInfo: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      emailID: {
        type: String,
        required: true,
        trim: true,
      },
      mobileNumber: {
        type: String,
        required: true,
        trim: true,
      },
      playerLocation: {
        type: String,
        // required: true,
        // trim: true,
      },
    },
  ],
});

module.exports = mongoose.model('playerPost', playerPostSchema);
