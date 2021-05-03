const db = require('../../core/db')

module.exports = db.sequelize.define(
  'class_materi',
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
    path: {
      type: db.Sequelize.TEXT,
      allowNull: false,
    },
    class_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    }
  }
)
