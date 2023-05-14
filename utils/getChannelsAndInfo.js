const { Channel } = require("../database")

const getChannelsAndInfo = async (currentChannel) => {
  const channels = await Channel.find({}, { name: 1 })
  const channelInfo = await Channel.findOne({ name: currentChannel }, { messages: 1, members: 1 }).populate("messages")
  return { channels, channelInfo }
}

module.exports = getChannelsAndInfo