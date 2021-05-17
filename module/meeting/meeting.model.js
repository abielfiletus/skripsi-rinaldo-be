const db = require('../../core/db')

module.exports = db.sequelize.define(
  'meeting',
  {
    id: {
      type: db.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    usulan_meeting_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false
    },
    start_date: {
      type: db.Sequelize.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: db.Sequelize.DATEONLY,
      allowNull: false,
    },
    link: {
      type: db.Sequelize.STRING,
    }
  }
)
