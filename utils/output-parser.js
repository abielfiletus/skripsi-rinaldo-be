require('dotenv').config()

class OutputParser {
  fail(res, code, msg = null, err, errServer) {
    const json = {
      // code: code,
      // status: false,
      error: err
    }

    if (msg) json['message'] = msg

    res.status(code).json(json)
  }

  success(res, code, msg = null, data = null) {
    const json = {
      // code: code,
      // status: true
    }

    if (msg) json['msg'] = msg
    if (data) json['data'] = data

    res.status(code).json(json)
  }

  file(res, code, file) {
    res.status(code).sendFile(file)
  }
}

module.exports = new OutputParser()
