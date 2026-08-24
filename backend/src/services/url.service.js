const prisma = require('../config/database')
const redis = require('../config/redis')
const { encode, generateRandomCode } = require('../utils/base62')
const { normalizeUrl } = require('../utils/urlValidator')

const CACHE_TTL = 86400


async function createShortUrl(originalUrl, customCode = null) {

  const normalizedUrl = normalizeUrl(originalUrl)

  const existingUrl = await prisma.url.findFirst({
    where: { originalUrl: normalizedUrl }
  })

  if (existingUrl) {
    return existingUrl
  }

  if (customCode) {
    const existingCode = await prisma.url.findUnique({
      where: { shortCode: customCode }
    })

    if (existingCode) {
      throw new Error('CUSTOM_CODE_TAKEN')
    }

    const newUrl = await prisma.url.create({
      data: {
        originalUrl: normalizedUrl,
        shortCode: customCode
      }
    })

    await cacheUrl(newUrl.shortCode, newUrl.originalUrl)

    return newUrl
  }

  const newUrl = await prisma.url.create({
    data: {
      originalUrl: normalizedUrl,
      shortCode: `temp_${Date.now()}` 
    }
  })

  const shortCode = encode(newUrl.id)

  const updatedUrl = await prisma.url.update({
    where: { id: newUrl.id },
    data: { shortCode }
  })

  await cacheUrl(updatedUrl.shortCode, updatedUrl.originalUrl)

  return updatedUrl
}

async function getUrlByShortCode(shortCode) {

  const cachedUrl = await redis.get(`url:${shortCode}`)

  if (cachedUrl) {
    console.log(`Cache HIT for ${shortCode}`)
    return { originalUrl: cachedUrl, fromCache: true }
  }

  console.log(`Cache MISS for ${shortCode}`)
  const url = await prisma.url.findUnique({
    where: { shortCode }
  })

  if (!url) {
    return null
  }

  await cacheUrl(url.shortCode, url.originalUrl)

  return url
}


async function cacheUrl(shortCode, originalUrl) {
    
  await redis.set(`url:${shortCode}`, originalUrl, 'EX', CACHE_TTL)
}

module.exports = {
  createShortUrl,
  getUrlByShortCode
}