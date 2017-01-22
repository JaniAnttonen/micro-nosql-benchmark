const { send } = require('micro')
const http = require('http')
const url = require('url')
const qs = require('querystring')
const serveStatic = require('serve-static')
const finalhandler = require('finalhandler')
const crypto = require('crypto')

// The tests
const testRedis = require('./redis').testRedis
const testMongo = require('./mongo').testMongo

// Function for creating dummy session data
const createHash = (password) => {
  return crypto.createCipher('aes192', `${password}${Date.now()}`)
}

const userData = () => (
  {isAdmin: false, language: "13375P34K"}
)

// Create an array of dummy session data with a specified length
const createData = (iterations, hash) => {
  const items = []
  let i = 0
  for (i; i < iterations; i++) {
    items.push([i, hash, userData])
  }
  return items
}


/**
 * File server for the html test page
 */
const serve = serveStatic('public/', {'index': 'index.html'})
 
// Create server 
var staticServer = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res))
})
 
// Listen 
staticServer.listen(8000)


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
  const hash = createHash(user)
  const data = createData(iterations, hash)
  
  // Default time
  let elapsed = 0

  // Routing
  switch(endpoint){
    case '/redis': elapsed = await testRedis(data)
    case '/mongo': elapsed = await testMongo(data)
  }
  
  // Allow the test site to control the API
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Send data
  send(res, 200,`${elapsed}`)
}