const service = require('./role.service')
const outputParser = require('../../utils/output-parser')

class RoleController {

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
        name: req.body.name ? req.body.name : null,
        permissions: req.body.permissions ? req.body.permissions : null
      }

      const data = await service.create(bulk)

      return outputParser.success(res, 201, 'Succssfully Create Data')
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const bulk = {
        name: req.body.name ? req.body.name : null,
        permissions: req.body.permissions ? req.body.permissions : null
      }

      const check = await service.getOne(req.params.id)

      if (!check) return outputParser.fail(res, 400, 'Validation Error', { id: 'Tidak ditemukan' }, '', '')

      const data = await service.update(req.params.id, bulk)

      return outputParser.success(res, 200, 'Validation Error', data)
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const check = await service.getOne(req.params.id)

      if (!check) return outputParser.fail(res, 400, 'Validation Error', { id: 'Tidak ditemukan' }, '', '')
    } catch (err) {
      next(err)
    }
  }

}

module.exports = new RoleController()
