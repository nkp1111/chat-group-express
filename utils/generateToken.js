const jwt = require("jsonwebtoken")
const jwtSecret = process.env.JSON_WEB_TOKEN_SECRET

const generateToken = (username) => {
  // generate jwt token for authentication
  const token = jwt.sign(
    { token: username },
    jwtSecret,
    { expiresIn: 60 * 60 }
  )
  return token
}

module.exports = { generateToken }