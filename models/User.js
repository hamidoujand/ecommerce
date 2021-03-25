let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let { default: validator } = require("validator");
let bcrypt = require("bcryptjs");

let userSchema = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    lowercase: true,
    minLength: [4, "username can not be lower than 4 characters"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message(prop) {
        return `${prop.value} is invalid Email Address`;
      },
    },
  },
  password: {
    type: String,
    minLength: [8, "password must be at least 8 characters long"],
    required: [true, "password is required"],
    trim: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "password confirmation is required"],
    validate: {
      validator(value) {
        return value === this.password;
      },
      message: "password and password confirmation do not match",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "invalid role for user",
    },
    default: "user",
  },
  passwordChangedAt: Date,
});

//*************** HASH PASSWORD ****************** */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  let hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  this.passwordConfirm = undefined;
  next();
});

//******************* INSTANCE METHOD FOR PASSWORD CHECK *************************** */
userSchema.methods.isPasswordMatch = async function (hashPass, rawPass) {
  return await bcrypt.compare(rawPass, hashPass);
};

let User = mongoose.model("User", userSchema);

module.exports = User;
