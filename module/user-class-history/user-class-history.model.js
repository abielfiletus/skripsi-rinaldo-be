const db = require('../../core/db')

module.exports = db.sequelize.define(
  'user_class_history',
  {
    id: {
      type: db.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    class_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    class_materi_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    class_quiz_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    durasi: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    nilai: {
      type: db.Sequelize.DOUBLE,
      allowNull: false,
    },
    status: {
      type: db.Sequelize.STRING(20),
      allowNull: false,
    }
  }
)
