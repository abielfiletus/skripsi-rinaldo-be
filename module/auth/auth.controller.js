const jwt = require('jsonwebtoken')

const service = require('../user/user.service')
const outputParser = require('../../utils/output-parser')

require('dotenv').config()

class AuthController {

  async login(req, res, next) {
    try {
      const data = await service.getOneByEmailPass(req.body.email, req.body.password)

      if (!data.success) return outputParser.fail(res, 401, data.error, '', '')

      const payload = {
        id: data.data['id'],
        email: data.data['email']
      }

      const result = data.data
      result['token'] = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256' })

      delete result['password']
      return outputParser.success(res, 200, 'Successully Login', result)
    } catch (err) {
      next(err)
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const check = await service.getOneByEmailPass(req.body.email)

      if (!check.success) return outputParser.fail(res, 400, 'Email tidak ditemukan', '', '')

      const pass = check.data['tanggal_lahir'].replace(/[\-]/, '')
      const id = check.data['id']
      const nama_depan = check.data['nama_depan']
      const nama_belakang = check.data['nama_belakang']
      const jenis_kelamin = check.data['jenis_kelamin']
      const status_pekerjaan = check.data['status_pekerjaan']
      const tanggal_lahir = check.data['tanggal_lahir']
      const no_hp = check.data['no_hp']
      const email = check.data['email']

      await service.update(id, nama_depan, nama_belakang, jenis_kelamin, status_pekerjaan, tanggal_lahir, no_hp, email, pass)

      return outputParser.success(res, 200, 'Successfully Reset Password', '')
    } catch (err) {
      next(err)
    }
  }

}

module.exports = new AuthController()
