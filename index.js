const { send } = require('micro')
const sleep = require('then-sleep')
const crypto = require('crypto')
const redis = require('redis').createClient()
const mongo = require('mongodb').MongoClient
const perfy = require('perfy')

const createCipher = (password) => {
  return crypto.createCipher('aes192', `${password}${Date.now()}`)
}

const test = (iterations) => {
  let i = 0
  for (i; i < iterations; i++) {
    redis.set(`${i}`, `${createCipher("Ebin")}`);
  }
}

module.exports = async (req, res) => {
  perfy.start('timeNeeded')
  await test(1000000)
  send(res, 200, `The test took ${perfy.end('timeNeeded').time} s`)
}