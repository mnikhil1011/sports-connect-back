const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

const coachPostSchema = new mongoose.Schema(
  {
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
    court: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    selectedSlot: {
      type: String,
      required: true,
      // trim: true,
    },

    createdBy: {
      ///PID
      ref: 'coach', // Assuming a Player model exists
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
        skill: {
          type: String,
          // required: true,
          enum: ['Beginner', 'Intermediate', 'Advanced'],
          default: 'Intermediate',
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('coachPost', coachPostSchema);
