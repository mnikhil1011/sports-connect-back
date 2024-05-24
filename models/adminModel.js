const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
   
    emailID: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
   
  },

  
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
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

adminSchema.statics.login = async function (emailID, password) {
  const admin = await this.findOne({ emailID });
  if (!admin) throw Error("You aren't admin");

  const auth = await bcrypt.compare(password, admin.password);
   if (!auth) throw Error("Wrong Admin Password");
  return admin;
};

module.exports = mongoose.model('admin', adminSchema);
