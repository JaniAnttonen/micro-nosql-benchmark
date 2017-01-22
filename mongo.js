const perfy = require('perfy')
const mongo = require('mongodb').MongoClient

const testMongo = async (data) => {
  // Start the timer
  perfy.start('timeMongo')
  
  // Use connect method to connect to the Server
  await data.filter((index, hash, userData) => {
    mongo.connect('mongodb://localhost:27017/test', (err, db) => {
      db.collection('sessiontest').insertOne({hash:userData}, {upsert:true}, (err, result) => {
        db.close()
      })
    })
  })

  return perfy.end('timeMongo').milliseconds
}

exports.testMongo = testMongo