const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const coachSchema = new mongoose.Schema(
  {
    emailID: {
      type: String,
      required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    // emailID: {
    //   type: String,
    //   required: true,
    // },
    // password: {
    //   type: String,
    //   required: true,
    // },
    mobileNumber: {
      type: String,
      required: true,
    },

    applied_students: [
      {
        player_id: {
          type: String,
        },
        skill: {
          type: String,
          // required: true,
          enum: ['Beginner', 'Intermediate', 'Advanced'],
          default: 'Intermediate',
        },
        postId: { type: String },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    About: {
      type: String,
      // required: true,
      trim: true,
    },
    location: {
      type: String,
    },

    sport: {
      type: String,
      // required: true,
      enum: ['Football', 'Basketball', 'Tennis', 'Swimming', 'Badminton'],
    },
    coaching_experience_years: {
      type: Number,
      // required: true,
    },
    certifications: {
      type: String,
      // required: true,
    },
    // Add more fields as needed, such as coaching style, methodology, etc.

    achievements: [
      {
        title: {
          type: String,
          // required: true,
        },
        description: {
          type: String,
          // required: true,
        },
        date: {
          type: Date,
          // required: true,
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

coachSchema.pre('save', async function (next) {
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

coachSchema.statics.login = async function (emailID, password) {
  const coach = await this.findOne({ emailID });
  if (!coach) throw Error('no such coach');
  const auth = await bcrypt.compare(password, coach.password);
  if (!auth) throw Error('wrong <> password');
  return coach;
};

module.exports = mongoose.model('coach', coachSchema);
