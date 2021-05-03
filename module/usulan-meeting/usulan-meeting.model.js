const db = require('../../core/db')

module.exports = db.sequelize.define(
  'user_meeting_history',
  {
    id: {
      type: db.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: db.Sequelize.STRING(100),
      allowNull: false,
    },
    description: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    start_date: {
      type: db.Sequelize.DATE,
      allowNull: false,
    },
    end_date: {
      type: db.Sequelize.DATE,
      allowNull: false,
    },
    class_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    }
  }
)
