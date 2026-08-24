const redis = require('../config/redis')

const WINDOW_SIZE_IN_SECONDS = 60
const MAX_REQUESTS = 10             

async function rateLimiter(req, res, next) {
  try {
    const ip = req.ip

    const key = `ratelimit:${ip}`

    const now = Date.now()

    const windowStart = now - (WINDOW_SIZE_IN_SECONDS * 1000)

    const pipeline = redis.pipeline()

    pipeline.zremrangebyscore(key, '-inf', windowStart)

    pipeline.zadd(key, now, now.toString())

    pipeline.zcard(key)

    pipeline.expire(key, WINDOW_SIZE_IN_SECONDS)

    const results = await pipeline.exec()

    const requestCount = results[2][1]

    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS)
    res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - requestCount))
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + WINDOW_SIZE_IN_SECONDS * 1000) / 1000))

    if (requestCount > MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again after 1 minute.',
        retryAfter: WINDOW_SIZE_IN_SECONDS
      })
    }

    next()

  } catch (error) {

    console.error('Rate limiter error:', error)
    next()
  }
}

module.exports = rateLimiter