const redis = require('../config/redis')
const prisma = require('../config/database')

const ANALYTICS_QUEUE_KEY = 'analytics:queue'

async function trackClick(shortCode, userAgent, urlId) {
  try {
    const clickEvent = {
      urlId,
      shortCode,
      userAgent: userAgent || 'unknown',
      clickedAt: new Date().toISOString()
    }

    await redis.rpush(ANALYTICS_QUEUE_KEY, JSON.stringify(clickEvent))
    console.log(`Click tracked for ${shortCode}, queued for DB write`)

  } catch (error) {
    console.error('Failed to track click:', error.message)
  }
}

async function getAnalytics(shortCode) {
  const url = await prisma.url.findUnique({
    where: { shortCode },
    include: {
      clicks: {
        orderBy: { clickedAt: 'desc' },
        take: 10
      }
    }
  })

  if (!url) {
    return null
  }

  return {
    shortCode: url.shortCode,
    originalUrl: url.originalUrl,
    totalClicks: url.clickCount,
    recentClicks: url.clicks,
    createdAt: url.createdAt
  }
}

module.exports = {
  trackClick,
  getAnalytics
}