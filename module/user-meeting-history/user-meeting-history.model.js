const db = require('../../core/db')

module.exports = db.sequelize.define(
  'user_meeting_history',
  {
    id: {
      type: db.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    meeting_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: db.Sequelize.STRING(20),
      allowNull: false,
    }
  }
)
