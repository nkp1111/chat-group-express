const { Channel, Message } = require("./database")

const addStartingMessage = async () => {
  // seed starting message for welcome channel
  const message = await Message.create({
    message: "Welcome to the Chat Group.",
    writer: {
      username: "n@g",
      userImage: "http://res.cloudinary.com/dxvkq8yw6/image/upload/v1683097350/Auth-app/en7jry5hrfndezuqynyp.jpg"
    }
  })
  const channel = await Channel.findOneAndUpdate({ name: "welcome" }, {
    $push: { messages: message._id }
  })
}

module.exports = addStartingMessage