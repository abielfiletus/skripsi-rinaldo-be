const db = require('../../core/db')

module.exports = db.sequelize.define(
  'user_class',
  {
    id: {
      type: db.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    class_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    }
  }
)
