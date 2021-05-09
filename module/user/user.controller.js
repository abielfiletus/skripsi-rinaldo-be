const path = require('path')
const fileSanitize = require('sanitize-filename')
const fs = require('fs-extra')

const service = require('./user.service')
const outputParser = require('../../utils/output-parser')

require('dotenv').config()

class UserController {

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
    const file = req.files['avatar']
    let clearName

    if (file) {
      const ext = (path.extname(file.name)).toLowerCase()

      if (!['.jpg', '.jpeg', 'png'].includes(ext)) return outputParser.fail(res, 400, 'Validation Error', {avatar: 'extention not allowed'}, '')

      clearName = fileSanitize(file.name)
    }
    try {
      await file.mv('./assets/avatar/' + clearName)

      const bulk = {
        name: req.body.name ? req.body.name : null,
        jenis_kelamin: req.body.jenis_kelamin ? req.body.jenis_kelamin : null,
        nis: req.body.nis ? req.body.nis : null,
        tanggal_lahir: req.body.tanggal_lahir ? req.body.tanggal_lahir : null,
        role_id: req.body.role_id ? req.body.role_id : null,
        email: req.body.email ? req.body.email : null,
        password: req.body.password ? req.body.password : null,
        avatar: clearName ? process.env.SITE_URL + '/assets/avatar/' + clearName : null,
      }

      const check = await service.getOneByEmailPass(bulk.email)

      if (check.success) return outputParser.fail(res, 400, 'Validation Error', { email: 'Sudah terdaftar' }, '', '')

      const data = await service.create(bulk)

      return outputParser.success(res, 201, 'Successfully Register', data)
    } catch (err) {
      if (fs.existsSync('./assets/avatar/' + clearName)) {
        fs.removeSync('./assets/avatar/' + clearName)
      }

      next(err)
    }
  }

  async update(req, res, next) {
    const file = req.files && req.files.hasOwnProperty('avatar') ? req.files['avatar'] : null
    let clearName

    if (file) {
      const ext = (path.extname(file.name)).toLowerCase()

      if (!['.jpg', '.jpeg', 'png'].includes(ext)) return outputParser.fail(res, 400, 'Validation Error', {avatar: 'extention not allowed'}, '')

      clearName = fileSanitize(file.name)
    }
    try {
      await file.mv('./assets/avatar/' + clearName)

      const bulk = {
        name: req.body.name ? req.body.name : null,
        jenis_kelamin: req.body.jenis_kelamin ? req.body.jenis_kelamin : null,
        nis: req.body.nis ? req.body.nis : null,
        tanggal_lahir: req.body.tanggal_lahir ? req.body.tanggal_lahir : null,
        role_id: req.body.role_id ? req.body.role_id : null,
        email: req.body.email ? req.body.email : null,
        password: req.body.password ? req.body.password : null,
        avatar: clearName ? process.env.SITE_URL + '/assets/avatar/' + clearName : null,
      }

      const check = await service.getOneByEmailPass(bulk.email)

      if (!check.success) return outputParser.fail(res, 400, 'Validation Error', { email: 'Tidak terdaftar' }, '', '')

      await service.update(req.params.id, bulk)
      const data = await service.getOne(req.params.id)

      return outputParser.success(res, 200, 'Successfully Update Data', data)
    } catch (err) {
      if (fs.existsSync('./assets/avatar/' + clearName)) {
        fs.removeSync('./assets/avatar/' + clearName)
      }

      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const check = await service.getOne(req.params.id)

      if (!check) return outputParser.fail(res, 400, 'Validation Error', { email: 'Tidak Terdaftar' }, '', '')

      const data = await service.delete(req.params.id)

      return outputParser.success(res, 200, 'Successfully Delete Data', data)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = new UserController()
