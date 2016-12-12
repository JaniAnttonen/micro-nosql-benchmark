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
  // Parse request
  const endpoint = url.parse(req.url).pathname
  const query = qs.parse(url.parse(req.url).query)
  const iterations = query && query.iter ? query.iter : 100
  const user = query && query.user ? query.user : 'Ebin'

  // Create dummy session hash
  const cipher = createCipher(user)
  const data = createData(iterations, cipher)
  
  // Default time sent to the user
  let elapsed = 0

  // Routing
  switch(endpoint){
    case '/redis': elapsed = await testRedis(data)
    case '/mongo': elapsed = await testMongo(data)
  }
  
  // Send data
  send(res, 200,`${elapsed}`)
}