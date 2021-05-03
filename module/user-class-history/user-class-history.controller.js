const service = require('./user-class-history.service')
const outputParser = require('../../utils/output-parser')

class UserClassHistoryController {

  async getAll(req, res, next) {
    try {
      const body = JSON.stringify(req.body) !== '{}' ? req.body : req.query

      const data = await service.getAll(body)

      return outputParser.success(res, 200, 'Successfully Get Data', data)
    } catch (err) {
      next(err)
    }
  }

  async getOne(req, res, next) {
    try {
      const data = await service.getOne(req.params.id)

      return outputParser.success(res, 200, 'Successfully Get Data', data)
    } catch (err) {
      next(err)
    }
  }

  async create(req, res, next) {
    try {
      const bulk = {
        class_id: req.body.class_id ? req.body.class_id : null,
        user_id: req.body.user_id ? req.body.user_id : null,
        class_materi_id: req.body.class_materi_id ? req.body.class_materi_id : null,
        class_quiz_id: req.body.class_quiz_id ? req.body.class_quiz_id : null,
        durasi: req.body.durasi ? req.body.durasi : null,
        nilai: req.body.nilai ? req.body.nilai : null,
        status: req.body.status ? req.body.status : null,
      }

      const data = await service.create(bulk)

      return outputParser.success(res, 201, 'Successfully Create Data', data)
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const check = await service.getOne(req.params.id)

      if (!check) return outputParser.fail(res, 400, 'Validation Error', { id: 'Tidak ditemukan' }, '')

      const bulk = {
        class_id: req.body.class_id ? req.body.class_id : null,
        user_id: req.body.user_id ? req.body.user_id : null,
        class_materi_id: req.body.class_materi_id ? req.body.class_materi_id : null,
        class_quiz_id: req.body.class_quiz_id ? req.body.class_quiz_id : null,
        durasi: req.body.durasi ? req.body.durasi : null,
        nilai: req.body.nilai ? req.body.nilai : null,
        status: req.body.status ? req.body.status : null,
      }

      const data = await service.update(req.params.id, bulk)

      return outputParser.success(res, 200, 'Successfully Edit Data', data)
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const check = await service.getOne(req.params.id)

      if (!check) return outputParser.fail(res, 400, 'Validation Error', { id: 'Tidak ditemukan' }, '')

      const data = await service.delete(req.params.id)

      return outputParser.success(res, 200, 'Successfully Delete Data', data)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = new UserClassHistoryController()
