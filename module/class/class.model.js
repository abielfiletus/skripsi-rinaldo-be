const db = require('../../core/db')

module.exports = db.sequelize.define(
  'class',
  {
    id: {
      type: db.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: db.Sequelize.STRING(50),
      allowNull: false,
    },
    code: {
      type: db.Sequelize.STRING,
      allowNull: false,
    }
  }
)
