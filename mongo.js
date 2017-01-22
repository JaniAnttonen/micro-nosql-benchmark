const perfy = require('perfy')
const mongo = require('mongodb').MongoClient

const testMongo = async (data) => {
  // Start the timer
  perfy.start('timeMongo')
  
  // Use connect method to connect to the Server
  await data.filter((index, hash) => {
    mongo.connect('mongodb://localhost:27017/test', (err, db) => {
      db.collection('sessiontest').insertOne({index:hash}, {upsert:true}, (err, result) => {
        db.close()
      })
    })
  })

  return perfy.end('timeMongo').milliseconds
}

exports.testMongo = testMongo