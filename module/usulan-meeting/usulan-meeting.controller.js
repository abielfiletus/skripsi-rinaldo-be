const service = require('./usulan-meeting.service')
const outputParser = require('../../utils/output-parser')

class UsulanMeetingController {

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
        user_id: req.body.user_id ? req.body.user_id : null,
        meeting_id: req.body.meeting_id ? req.body.meeting_id : null,
        status: req.body.status ? req.body.status : null,
      }

      const data = await service.create(bulk)

      return outputParser.success(res, 201, 'Successfully Insert Data', data)
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const bulk = {
        user_id: req.body.user_id ? req.body.user_id : null,
        meeting_id: req.body.meeting_id ? req.body.meeting_id : null,
        status: req.body.status ? req.body.status : null,
      }

      const check = await service.getOne(req.params.id, true)

      if (!check) return outputParser.fail(res, 400, 'Validation Error', { id: 'Tidak ditemukan' })

      const data = await service.update(req.params.id, bulk)

      return outputParser.success(res, 200, 'Successfully Update Data', data)
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const check = await service.getOne(req.params.id, true)

      if (!check) return outputParser.fail(res, 400, 'Validation Error', { id: 'Tidak ditemukan' })

      const data = await service.delete(req.params.id)

      return outputParser.success(res, 200, 'Successfully Delete Data', data)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = new UsulanMeetingController()
