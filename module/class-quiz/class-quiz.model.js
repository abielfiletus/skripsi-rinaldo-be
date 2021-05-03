const db = require('../../core/db')

module.exports = db.sequelize.define(
  'class_quiz',
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
    total_soal: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    nilai_lulus: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    class_materi_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    }
  }
)
