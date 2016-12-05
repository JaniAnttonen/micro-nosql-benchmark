const { send } = require('micro')
const crypto = require('crypto')

// The tests
const testRedis = require('./redis').testRedis
const testMongo = require('./mongo').testMongo

// Function for creating dummy session data
const createCipher = (password) => {
  return crypto.createCipher('aes192', `${password}${Date.now()}`)
}

const createData = (iterations, cipher) => {
  const items = []
  let i = 0
  for (i; i < iterations; i++) {
    items.push([i, cipher])
  }
  return items
}

module.exports = async (req, res) => {
  // Create dummy session hash
  const cipher = createCipher('Ebin')
  const data = createData(100, cipher)

  const redisTime = await testRedis(data)
  const mongoTime = await testMongo(data)
  
  // Say time required for all operations
  send(res, 200,
    `redis: ${redisTime} ms\nmongo: ${mongoTime} ms`
  )
}