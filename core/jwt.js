const jwt = require("express-jwt")
require("dotenv").config({path: __dirname+'/./../.env'})

module.exports = jwt({
  secret: process.env.JWT_SECRET || "defaulttokensecret",
  algorithms: ['HS256']
})
