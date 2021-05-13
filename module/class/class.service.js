const { Op } = require('sequelize')
const uniqid = require('uniqid')

const classModel = require('./class.model')
const userClassModel = require('../user-class/user-class.model')

class ClassService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = []

    if (body.form['name']) {
      where.push(`name iLike '%${body.form['name']}%'`)
    }

    if (body.form['user_id']) {
      where.push(`createdBy = '${body.form['user_id']}'`)
    }

    if (body.form['code']) {
      where.push(`code = '${body.form['code']}'`)
    }

    if (body.form['start']) {
      where.push(`start >= '${body.form['start']}'`)
    }

    if (body.form['end']) {
      where.push(`end <= '${body.form['end']}'`)
    }

    return classModel.sequelize.query(`SELECT c.id, c.name, c.code, c.end, c.start, c.nilai_lulus, count(DISTINCT uc.id) as student_total, count(DISTINCT cm.id) as materi_total FROM class c LEFT OUTER JOIN user_class uc ON c.id = uc.class_id LEFT OUTER JOIN class_materi cm ON c.id = cm.class_id ${where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''} GROUP BY 1 `)
  }

  async getOne(id) {
    return await classModel.findOne({ where: { id } })
  }

  async getOneByCode(code) {
    return await classModel.findOne({ where: { code: { [Op.iLike]: code } }, raw: true })
  }

  async create(bulk) {
    const code = uniqid.time() + Math.floor(Math.random() * 9)
    bulk['code'] = code.replace(/(\w{3})(\w{3})/, '$1-$2-').toUpperCase()

    return classModel.create(bulk)
  }

  async update(id, bulk) {
    Object.keys(bulk).map(el => {
      if (!bulk[el]) delete bulk[el]
    })

    return classModel.update(bulk, { where: { id } })
  }

  async delete(id) {
    return await classModel.destroy({ where: { id } })
  }

  async register(classId, userId) {
    return await userClassModel.create({ class_id: classId, user_id: userId })
  }

}

module.exports = new ClassService()
