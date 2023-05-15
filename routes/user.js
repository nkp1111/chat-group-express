const express = require("express")
const router = express.Router()

const { User } = require("../database")
const { generateToken } = require("../utils/generateToken")

// signin user if new user
router.post("/signin", async (req, res) => {
  const { username, password } = req.body
  // if all the data is not given
  if (!username || !password) {
    res.render("error", { msg: "fill all the data" })
    return
  } else {
    const isUser = await User.findOne({ username })
    if (isUser) {
      // if user is already present in database 
      res.render("error", { msg: "Username is taken choose another" })
      return
    } else {
      // authenticate user set token in session
      const token = generateToken(username)
      req.session.authorization = { token }
      const newUser = await User.create({ username, password })
      res.redirect("/")
      return
    }
  }
})

// login old user 
router.post("/login", async (req, res) => {
  const { username, password } = req.body
  // if all the data is not given
  if (!username || !password) {
    res.render("error", { msg: "fill all the data" })
    return
  } else {
    const isUser = await User.findOne({ username })
    if (!isUser) {
      // if user is not present in database
      res.render("error", { msg: "User is not in database" })
      return
    } else {
      // if user is confirmed set token for authentication
      const token = generateToken(username)
      req.session.authorization = { token }
      res.redirect("/")
      return
    }
  }
})

// logout user 
router.get("/logout", (req, res) => {
  // logout user by deleting authentication token
  delete req.session.authorization
  res.redirect("/")
})

module.exports = router