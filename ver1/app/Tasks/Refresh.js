'use strict'

const Task = use('Task')
const freePik = require('../Controllers/Http/FreepikController')

class Refresh extends Task {
  static get schedule () {
    return '0 * * * *'
  }

  async handle () {
    console.log('Run refresh');
    const fp = new freePik
    fp.refreshCsrfToken()
  }
}

module.exports = Refresh
