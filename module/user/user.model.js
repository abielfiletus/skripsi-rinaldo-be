const db = require('../../core/db')

module.exports = db.sequelize.define(
  'user',
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
    jenis_kelamin: {
      type: db.Sequelize.STRING(1),
      allowNull: false,
    },
    nis: {
      type: db.Sequelize.STRING(20),
      allowNull: false,
    },
    tanggal_lahir: {
      type: db.Sequelize.DATE,
      allowNull: false,
    },
    role_id: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
    },
    email: {
      type: db.Sequelize.STRING(50),
      allowNull: false,
    },
    password: {
      type: db.Sequelize.STRING,
      allowNull: false,
    },
    avatar: {
      type: db.Sequelize.STRING
    },
  }
)
