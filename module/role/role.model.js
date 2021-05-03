const db = require('../../core/db')

module.exports = db.sequelize.define(
  'role',
  {
    id: {
      type: db.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    permissions: {
      type: db.Sequelize.STRING,
    }
  }
)
