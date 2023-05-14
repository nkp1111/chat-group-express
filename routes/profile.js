const express = require("express")
const router = express.Router()

const { User } = require("../database")
const { cloudinary } = require("../cloudinary")

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

// update user info
router.post("/edit", async (req, res) => {
  if (req.user) {
    // check if req.user is present, authentication by middleware
    const { image, name, bio, phone } = req.body

    const imgResult = await cloudinary.uploader
      .upload(image, {
        folder: "group-chat"
      })

    let imageUrl = { url: imgResult.url, secure: imgResult.secure_url }

    try {
      const { token } = req.user
      const user = await User.findOneAndUpdate({ username: token }, { name, bio, phone, image: imageUrl })

      res.redirect("/profile")
      return
    } catch (error) {
      res.render("error", { msg: "Error Updating profile" })
      return
    }

  } else {
    res.redirect("/")
  }
})

module.exports = router