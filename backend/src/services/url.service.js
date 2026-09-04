const prisma = require('../config/database')
const redis = require('../config/redis')
const { encode, generateRandomCode } = require('../utils/base62')
const { normalizeUrl } = require('../utils/urlValidator')
const { isReserved } = require('../utils/reservedCodes')

const CACHE_TTL = 86400


async function createShortUrl(originalUrl, customCode = null) {

  if (customCode) {

    if (isReserved(customCode)) {
      const error = new Error('This code is reserved and cannot be used')
      error.statusCode = 400
      throw error
    }

    const existingCode = await prisma.url.findUnique({
      where: { shortCode: customCode }
    })

    if (existingCode) {
      const error = new Error('CUSTOM_CODE_TAKEN')
      error.statusCode = 409
      throw error
    }
  }

  const normalizedUrl = normalizeUrl(originalUrl)

  const existingUrl = await prisma.url.findFirst({
    where: { originalUrl: normalizedUrl }
  })

  if (existingUrl) {
    return existingUrl
  }

  if (customCode) {
    const newUrl = await prisma.url.create({
      data: {
        originalUrl: normalizedUrl,
        shortCode: customCode
      }
    })

    await cacheUrlBestEffort(newUrl.shortCode, newUrl.originalUrl, newUrl.id)

    return newUrl
  }

  const newUrl = await prisma.url.create({
    data: {
      originalUrl: normalizedUrl,
      shortCode: `temp_${Date.now()}`
    }
  })

  let shortCode = encode(newUrl.id)

  if (isReserved(shortCode)) {
    shortCode = generateRandomCode(6)
  }

  const updatedUrl = await prisma.url.update({
    where: { id: newUrl.id },
    data: { shortCode }
  })

  await cacheUrlBestEffort(updatedUrl.shortCode, updatedUrl.originalUrl, updatedUrl.id)

  return updatedUrl
}

async function getUrlByShortCode(shortCode) {

  const cachedData = await redis.get(`url:${shortCode}`)

  if (cachedData) {
    console.log(`Cache HIT for ${shortCode}`)

    const parsed = JSON.parse(cachedData)
    return { originalUrl: parsed.originalUrl, id: parsed.id, fromCache: true }
  }

  console.log(`Cache MISS for ${shortCode}`)
  const url = await prisma.url.findUnique({
    where: { shortCode }
  })

  if (!url) return null

  await cacheUrlBestEffort(url.shortCode, url.originalUrl, url.id)

  return url
}


async function cacheUrl(shortCode, originalUrl, urlId) {
  const cacheData = JSON.stringify({ originalUrl, id: urlId })
  await redis.set(`url:${shortCode}`, cacheData, 'EX', CACHE_TTL)
}

async function cacheUrlBestEffort(shortCode, originalUrl, urlId) {
  try {
    await cacheUrl(shortCode, originalUrl, urlId)
  } catch (err) {
    console.error('Cache write failed (non-fatal):', err.message)
  }
}

module.exports = {
  createShortUrl,
  getUrlByShortCode
}
