'use-strict'

class Helpers {

  static isNumber(string) {
    return !isNaN(string) && !isNaN(parseFloat(string))
  }
}

module.exports = Helpers