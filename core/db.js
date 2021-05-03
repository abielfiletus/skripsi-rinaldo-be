const Sequelize = require('sequelize')
const dotenv = require('dotenv')
const path = require('path')
const db = {}
dotenv.config({path: path.join(__dirname, '../.env')})

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  define: {
    freezeTableName: true,
  },
  logging: false,
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
