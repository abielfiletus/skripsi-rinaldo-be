const service = require('./usulan-meeting.service')
const outputParser = require('../../utils/output-parser')

class UsulanMeetingController {

  async getAll(req, res, next) {
    try {
      const body = JSON.stringify(req.body) !== '{}' ? req.body : req.query

      const data = await service.getAll(body)

      return outputParser.success(res, 200, 'Successfully Get Data', data[0])
    } catch (err) {
      next(err)
    }
  }

  async getAllNotMeeting(req, res, next) {
    try {
      const body = JSON.stringify(req.body) !== '{}' ? req.body : req.query

      const data = await service.getAllNotMeeting(body)

      return outputParser.success(res, 200, 'Successfully Get Data', data[0])
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
        name: req.body.name ? req.body.name : null,
        description: req.body.description ? req.body.description : null,
        start_date: req.body.start_date ? req.body.start_date : null,
        end_date: req.body.end_date ? req.body.end_date : null,
        class_id: req.body.class_id ? req.body.class_id : null,
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
        name: req.body.name ? req.body.name : null,
        description: req.body.description ? req.body.description : null,
        start_date: req.body.start_date ? req.body.start_date : null,
        end_date: req.body.end_date ? req.body.end_date : null,
        class_id: req.body.class_id ? req.body.class_id : null,
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
