const model = require('./user-chosen-meeting.model')

class UserChosenMeetingService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = []

    if (body.form['user_id']) {
      where.push(`user_id = '${body.form['user_id']}'`)
    }

    if (body.form['usulan_meeting_id']) {
      where.push(`usulan_meeting_id = '${body.form['usulan_meeting_id']}'`)
    }

    return await model.sequelize.query(`SELECT ucm.id, ucm.chosen_date, u.name, u2.name as student_name, u2.avatar FROM "user_chosen_meeting" ucm  JOIN "user" u ON ucm.user_id = u.id JOIN "user" u2 on u2.nis = u.nis AND u2.role_id = 2 ${where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''}`)
  }

  async getOne(id, raw=false) {
    return await model.findOne({ where: { id }, raw })
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

module.exports = new UserChosenMeetingService()
