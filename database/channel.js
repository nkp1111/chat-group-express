const mongoose = require("mongoose")

const ChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }
  ]
}, { timestamps: true })

const Channel = mongoose.model("Channel", ChannelSchema)

module.exports = Channel 