const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  writer: {
    username: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      required: true
    }
  },
  date: {
    type: Date,
    default: new Date()
  }
})

const Message = mongoose.model("Message", MessageSchema)

module.exports = Message 