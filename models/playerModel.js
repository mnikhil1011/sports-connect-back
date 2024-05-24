const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    emailID: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },

    applied: [
      {
        name: {
          type: String,
        },
      },
    ],
    starred: [
      {
        post_id: {
          type: String,
        },
      },
    ],
    location: {
      type: String,
    },

    gaming_statistics: [
      {
        sport: {
          type: String,
          // required: true,
          // enum: ['Football', 'Basketball', 'Tennis', 'Swimming', 'Badminton'],
        },
        skill: {
          type: String,
          // required: true,
          enum: ['Beginner', 'Intermediate', 'Advanced'],
          default: 'Intermediate',
        },
      },
    ],
    communication_preferences: {
      preferred_language: {
        type: String,
        default: 'English',
      },
    },
    social_interactions: {
      bio: {
        type: String,
      },
      interests: {
        type: [String],
      },
      social_media_links: {
        facebook: {
          type: String,
        },
        twitter: {
          type: String,
        },
        instagram: {
          type: String,
        },
      },
    },
    feedback_and_ratings: {
      reviews: [
        {
          type: String,
        },
      ],
      ratings: {
        type: Number,
        default: 0,
      },
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

playerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // If password is not modified, move to the next middleware
  }

  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

playerSchema.statics.login = async function (emailID, password) {
  const player = await this.findOne({ emailID });
  if (!player) throw Error('no such player');
  const auth = await bcrypt.compare(password, player.password);
  if (!auth) throw Error('wrong password');
  return player;
};

module.exports = mongoose.model('player', playerSchema);
