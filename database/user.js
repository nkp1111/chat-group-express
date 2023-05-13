const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String
  },
  image: {
    url: { type: String },
    secure: { type: String }
  },
  bio: {
    type: String
  },
  phone: {
    type: String,
  },
  lastVisitedChannel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel"
  }
})

const User = mongoose.model("User", UserSchema)

module.exports = { User }