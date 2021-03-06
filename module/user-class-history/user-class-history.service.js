const moment = require('moment')
const model = require('./user-class-history.model')

class UserClassHistoryService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = []

    if (body.form['class_id']) {
      where.push(`uch."class_id" = ${body.form['class_id']}`)
    }

    if (body.form['user_id']) {
      where.push(`uch."user_id" = ${body.form['user_id']}`)
    }

    if (body.form['start']) {
      where.push(`uch."createdAt" BETWEEN '${moment(body.form['start'], 'YYYY-MM-DD').startOf('day')}' AND '${moment(body.form['end'], 'YYYY-MM-DD').endOf('day')}'`)
    }

    if (body.form['class_materi_id']) {
      where.push(`uch."class_materi_id" = ${body.form['class_materi_id']}`)
    }

    return await model.sequelize.query(`SELECT DISTINCT uch.id, uch.status, uch.nilai, uch.durasi, uch.class_materi_id, cm.name as class_materi_name, u.name, u.avatar FROM user_class_history uch JOIN class_materi cm ON uch.class_materi_id = cm.id JOIN "user" u ON uch.user_id = u.id ${where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY uch.class_materi_id`)
  }

  async getOne(id, raw=false) {
    return await model.findOne({ where: { id }, raw })
  }

  async getOneByUserAndMateriId(user_id, class_materi_id) {
    return await model.findOne({ where: { user_id, class_materi_id }, raw: true })
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

module.exports = new UserClassHistoryService()
