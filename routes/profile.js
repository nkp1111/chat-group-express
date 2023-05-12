const express = require("express")
const router = express.Router()

const { User } = require("../database/user")

router.get("/", async (req, res) => {
  let user = null
  if (req.user) {
    // check if req.user is present, authentication by middleware
    const { token } = req.user
    const userInfo = await User.findOne({ username: token })
    res.render("profile/index", { user: userInfo })
    return
  } else {
    res.redirect("/")
  }
})

module.exports = router