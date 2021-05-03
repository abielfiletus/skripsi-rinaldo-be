const db = require('../../core/db')

module.exports = db.sequelize.define(
  'user_chosen_meeting',
  {
    id: {
      type: db.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false
    },
    usulan_meeting_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    chosen_date: {
      type: db.Sequelize.DATEONLY,
      allowNull: false,
    },
    chosen_time: {
      type: db.Sequelize.TIME,
    },
  }
)
