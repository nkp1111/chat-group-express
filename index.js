const express = require("express")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")
const MongoDBStore = require("connect-mongo")
const session = require("express-session")
const jwt = require("jsonwebtoken")

const { User } = require("./database/user")

const port = process.env.PORT || 3000
const mongoUrl = process.env.MONGO_URL
const jwtSecret = process.env.JSON_WEB_TOKEN_SECRET

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
app.use(express.urlencoded({ extended: true }))
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
app.get("/", (req, res) => {
  let user = null
  if (req.user) {
    // check if req.user is present, authentication by middleware
    const { token } = req.user
    user = token
  }
  res.render("index", { user })
})

// signin user if new user
app.post("/signin", async (req, res) => {
  const { username, password } = req.body
  // if all the data is not given
  if (!username || !password) {
    res.send("fill all the data")
  } else {
    const isUser = await User.findOne({ username })
    if (isUser) {
      // if user is already present in database 
      res.send("Username is taken choose another")
      return
    } else {
      // authenticate user set token in session
      const token = jwt.sign(
        { token: username },
        jwtSecret,
        { expiresIn: 60 * 60 }
      )

      req.session.authorization = { token }
      const newUser = await User.create({ username, password })
      res.redirect("/")
      return
    }
  }
})

// login old user 
app.post("/login", async (req, res) => {
  const { username, password } = req.body
  // if all the data is not given
  if (!username || !password) {
    res.send("fill all the data")
  } else {
    const isUser = await User.findOne({ username })
    if (!isUser) {
      // if user is not present in database
      res.send("User is not in database")
      return
    } else {
      // if user is confirmed set token for authentication
      const token = jwt.sign(
        { token: username },
        "access",
        { expiresIn: 60 * 60 }
      )
      req.session.authorization = { token }
      res.redirect("/")
      return
    }
  }
})

// logout user 
app.get("/logout", (req, res) => {
  // logout user by deleting authentication token
  delete req.session.authorization
  res.redirect("/")
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})