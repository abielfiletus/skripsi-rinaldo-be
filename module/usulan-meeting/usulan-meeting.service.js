const { Op } = require('sequelize')

const userChosenMeetingModel = require('../user-chosen-meeting/user-chosen-meeting.model')
const model = require('./usulan-meeting.model')

class UsulanMeetingService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = []

    if (body.form['name']) {
      where.push(`um.name iLike '%${body.form['name']}%'`)
    }

    if (body.form['class_id']) {
      where.push(`um.class_id = '${body.form['class_id']}'`)
    }

    return await model.sequelize.query(`SELECT um.id, um.name, um.class_id, um.description, um.start_date, um.end_date, c.name as class_name, (SELECT count(ucm.id) FROM "user_chosen_meeting" ucm WHERE ucm.usulan_meeting_id = um.id AND ucm.chosen_date IS NULL) as not_choose, (SELECT count(ucm.id) FROM "user_chosen_meeting" ucm WHERE ucm.usulan_meeting_id = um.id AND ucm.chosen_date IS NOT NULL) as choose FROM "usulan_meeting" um JOIN "class" c on um.class_id = c.id WHERE c."createdBy" = '${body.form['user_id']}' ${where.join(' AND ')}`)
  }

  async getOne(id, raw=false) {
    return await model.findOne({ where: { id }, raw })
  }

  async create(bulk) {
    const trx = await model.sequelize.transaction()
    try {
      const inserted = await model.create(bulk, { transaction: trx });
      const user = await userChosenMeetingModel.sequelize.query(`SELECT u.id FROM "user" u JOIN "user" u2 ON u.nis = u2.nis JOIN user_class uc on u2.id = uc.user_id WHERE u.role_id = 3 AND uc.id = ${bulk['class_id']}`)

      if (user[0].length > 0) {
        const userData = []
        const id = inserted.getDataValue('id')
        user[0].map(el => {
          userData.push({
            user_id: el.id,
            usulan_meeting_id: id
          })
        })

        await userChosenMeetingModel.bulkCreate(userData, { transaction: trx })
      }

      await trx.commit()
      return inserted
    } catch (err) {
      console.log(err)
      await trx.rollback()
    }
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

module.exports = new UsulanMeetingService()
