const db = require('../../core/db')

module.exports = db.sequelize.define(
  'quiz_detail',
  {
    id: {
      type: db.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    class_quiz_id: {
      type: db.Sequelize.INTEGER,
      allowNull: true,
    },
    soal: {
      type: db.Sequelize.TEXT,
      allowNull: false,
    },
    jawaban_a: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    jawaban_b: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    jawaban_c: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    jawaban_d: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    jawaban_e: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    jawaban_benar: {
      type: db.Sequelize.STRING(1),
      allowNull: false,
    }
  }
)
