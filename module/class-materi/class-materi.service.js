const { Op } = require('sequelize')

const model = require('./class-materi.model')
const classQuizModel = require('../class-quiz/class-quiz.model')

class ClassMateriService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    let where = ''

    if (body.form['name']) {
      where += `cm.name iLike "%${body.form['name']}%"`
    }

    if (body.form['class_id']) {
      where += `cm.class_id = "${body.form['name']}"`
    }

    // const offset = body.offset ? parseInt(body.offset) : 0
    // const limit = body.length && body.length > 0 ? parseInt(body.length) : 10000000
    // const order = [body.order ? body.order : ['id', 'ASC']]
    // const include = {
    //   model: classQuizModel,
    //   as: 'quiz',
    // }

    return await model.sequelize.query(`SELECT cm.id, cm.name, cm.path, cm.class_id, c.name as class_name, cq.id as quiz_id, cq.name as quiz_name, cq.total_soal as quiz_total_soal, cq.nilai_lulus as quiz_nilai_lulus, cq.class_materi_id, uch.status FROM class_materi cm JOIN class c ON cm.class_id = c.id LEFT OUTER JOIN class_quiz cq ON cm.id = cq.class_materi_id LEFT OUTER JOIN user_class_history uch ON cq.id = uch.class_id AND uch.user_id = ${body.form['user_id']} ${where}`)[0];
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
