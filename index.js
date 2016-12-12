const { send } = require('micro')
const url = require('url')
const qs = require('querystring')
const nodeStatic = require('node-static')
const crypto = require('crypto')

// The tests
const testRedis = require('./redis').testRedis
const testMongo = require('./mongo').testMongo

// Function for creating dummy session data
const createCipher = (password) => {
  return crypto.createCipher('aes192', `${password}${Date.now()}`)
}

// Create an array of dummy session data with a specified length
const createData = (iterations, cipher) => {
  const items = []
  let i = 0
  for (i; i < iterations; i++) {
    items.push([i, cipher])
  }
  return items
}

// File server for the test html page
const fileServer = new nodeStatic.Server()
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serveFile('/index.html', 200, {}, request, response)
    }).resume()
}).listen(8080)

/**
 * Endpoints for the performance tests
 */
module.exports = async (req, res) => {
  // Create dummy session hash
  const cipher = createCipher('Ebin')
  const data = createData(100, cipher)

  console.log(req)
  const redisTime = await testRedis(data)
  const mongoTime = await testMongo(data)
  
  // Say time required for all operations
  send(res, 200,
    `redis: ${redisTime} ms\nmongo: ${mongoTime} ms`
  )
}