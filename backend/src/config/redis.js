const Redis = require('ioredis')

const redis = new Redis(process.env.REDIS_URL, {
    maxRestriesPerRequest: 3,

    retryStrategy(times) {
        if(times > 3) {
            console.error('Redis connection failed after 3 retries')
            return null
        }

        return times * 200
    }
})

redis.on('connect', () => {
    console.log('Redis connected successfully')
})

redis.on('error', (err) => {
    console.error('Redis connection error:', err.message)
})

module.exports = redis