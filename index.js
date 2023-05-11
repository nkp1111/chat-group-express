const express = require("express")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")
const MongoDBStore = require("connect-mongo")
const session = require("express-session")
const jwt = require("jsonwebtoken")

const userRoutes = require("./routes/user")

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
app.use(express.static(__dirname + "/static"))
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

// add user routes allow signin, login and logout
app.use("/user", userRoutes)


app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})