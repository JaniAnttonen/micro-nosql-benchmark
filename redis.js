const perfy = require('perfy')
const redis = require('redis').createClient()

const writeRedis = async(data) => {
    let i = 0

    // Start the timer
    perfy.start('timeRedis')

    await data.filter((index, hash, userData) => {
        redis.set(`${hash}`, `${userData}`)
    })

    return perfy.end('timeRedis').milliseconds
}

const readRedis = async(data) => {
    let i = 0

    // Start the timer
    perfy.start('timeRedis')

    await data.filter((index, hash) => {
        redis.get(`${hash}`)
    })

    return perfy.end('timeRedis').milliseconds
}


exports.writeRedis = writeRedis
exports.readRedis = readRedis