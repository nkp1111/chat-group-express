const express = require("express")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")
const MongoDBStore = require("connect-mongo")
const session = require("express-session")
const jwt = require("jsonwebtoken")
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const userRoutes = require("./routes/user")
const profileRoutes = require("./routes/profile")
const { User, Channel, Message } = require("./database")
const getChannelsAndInfo = require("./utils/getChannelsAndInfo")


const port = process.env.PORT || 3000
const mongoUrl = process.env.MONGO_URL
const jwtSecret = process.env.JSON_WEB_TOKEN_SECRET

let allUsers = {}
let currentActiveUser = 0
let allChannelNames = []

// connects to mongo database
mongoose.connect(mongoUrl)
  .then(() => {
    console.log("mongoose connected")
  })
  .catch(err => {
    console.log(err)
  })

// create mongo store in mongo database
const mongoStoreSecret = process.env["MONGO_STORE_SECRET"] || "a_bad_secret"
let store = MongoDBStore.create({
  mongoUrl,
  secret: mongoStoreSecret,
  touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
  console.log("session store error", e)
})

// basic configuration
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.use(express.static(__dirname + "/static"))
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(session({
  name: "session",
  store,
  resave: true,
  saveUninitialized: true,
  secret: "Agoodsecret",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))

// middleware check if user is logged in and set req.user
app.use("/", (req, res, next) => {
  if (req.session.authorization) {
    let token = req.session.authorization['token']
    jwt.verify(token, jwtSecret, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next()
})

// home route show user if present else show signup/login form
app.get("/", async (req, res) => {
  let user = null
  if (req.user) {
    // check if req.user is present, authentication by middleware
    const { token } = req.user
    user = await User.findOne({ username: token })

    if (!allUsers.hasOwnProperty(token)) {
      allUsers[token] = {
        currentChannel: user.lastVisitedChannel || "welcome",
        userImage: user.image.url
      }
    }

    const { currentChannel } = allUsers[token]

    getChannelsAndInfo(currentChannel).then((data) => {
      const { channels, channelInfo } = data
      allChannelNames = channels.map(c => c.name)
      // console.log(channelInfo)
      res.render("index", { user, channels, channelInfo })
      return
    })
  }
  else {
    res.render("index", { user })
  }
})

app.use("/user", userRoutes)
app.use("/profile", profileRoutes)

app.get("/channel/add", async (req, res) => {
  // add new channel to list
  try {
    const { token } = req.user
    const { name, description } = req.query

    await Channel.create({
      name,
      description,
      members: [
        {
          name: token,
          image: allUsers[token].userImage
        }
      ],
      messages: []
    })

    allUsers[token].currentChannel = name
    await User.updateOne({ username: token }, { lastVisitedChannel: name })
    res.redirect("/")
  } catch (error) {
    console.log(error)
  }
})

app.get("/channel/:channelName", async (req, res) => {
  // change channel to chat
  const { channelName } = req.params
  const { token } = req.user

  try {
    if (allChannelNames.includes(channelName)) {
      allUsers[token].currentChannel = channelName
      await User.updateOne({ username: token }, { lastVisitedChannel: name })
    }
    res.redirect("/")
  } catch (error) {
    console.log(error)
  }
  res.redirect("/")
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})


///////////////// socket /////////////////
// starting connection
io.on("connection", function (socket) {
  console.log("A user connected")
  currentActiveUser += 1

  socket.emit("count", currentActiveUser)

  // on disconnection of a user
  socket.on("disconnect", function () {
    console.log("user disconnected")
    currentActiveUser -= 1
    io.emit("count", currentActiveUser)
  })
})


////////////////////////////////////////