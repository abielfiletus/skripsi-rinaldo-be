const model = require('../user-class-history/user-class-history.model')

class DashboardService {

  async getAll(body) {
    const where = []

    if (body.user_id) {
      where.push(`uc.user_id = ${body.user_id}`)
    }

    if (body.class_id) {
      where.push(`uc.class_id = ${body.class_id}`)
    }

    return await model.sequelize.query(`SELECT uc.id, sum(uch.nilai) as nilai, sum(uch.durasi) as durasi, (CASE WHEN sum(uch.nilai) is null THEN null WHEN (select nilai_lulus from class where id = ${body.class_id}) < sum(uch.nilai) THEN 'Lulus' ELSE 'Tidak Lulus' END) as status from user_class uc LEFT JOIN user_class_history uch on uch.user_id = uc.id ${where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''} group by 1`)
  }

}

module.exports = new DashboardService()
