const { send } = require('micro')
const sleep = require('then-sleep')
const crypto = require('crypto')
const redis = require('connect-redis')
const mongo = require('connect-mongo')

module.exports = async (req, res) => {
  await sleep(500)
  send(res, 200, 'Ready!')
}