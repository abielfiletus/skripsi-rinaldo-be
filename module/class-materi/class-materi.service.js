const { Op } = require('sequelize')

const model = require('./class-materi.model')
const classQuizModel = require('../class-quiz/class-quiz.model')

class ClassMateriService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = []

    if (body.form['name']) {
      where.push(`cm.name iLike "%${body.form['name']}%"`)
    }

    if (body.form['class_id']) {
      where.push(`cm.class_id = "${body.form['name']}"`)
    }

    return await model.sequelize.query(`SELECT DISTINCT cm.id, cm.name, cm.path, cm.class_id, c.name as class_name, cq.id as quiz_id, cq.name as quiz_name, cq.total_soal as quiz_total_soal, cq.nilai_lulus as quiz_nilai_lulus, cq.class_materi_id, cq.tanggal_kumpul, uch.status, uch.id as history_id FROM class_materi cm JOIN class c ON cm.class_id = c.id LEFT OUTER JOIN class_quiz cq ON cm.id = cq.class_materi_id LEFT OUTER JOIN user_class_history uch ON cq.id = uch.class_id AND uch.user_id = ${body.form['user_id']} ${where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''}`);
  }

  async getOne(id) {
    return await model.findOne({ where: { id } })
  }

  async create(bulk) {
    return model.create(bulk)
  }

  async update(id, bulk) {
    Object.keys(bulk).map(el => {
      if (!bulk[el]) delete bulk[el]
    })

    return model.update(bulk, { where: { id } })
  }

  async delete(id) {
    return model.destroy({ where: { id } })
  }

}

module.exports = new ClassMateriService()
