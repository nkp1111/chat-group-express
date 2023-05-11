const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  let user = null
  if (req.user) {
    // check if req.user is present, authentication by middleware
    const { token } = req.user
    user = token
    // const userInfo = 
    res.render("profile/index", { user })
    return
  } else {
    res.redirect("/")
  }
})

module.exports = router