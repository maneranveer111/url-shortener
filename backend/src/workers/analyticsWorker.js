const redis = require('../config/redis')
const prisma = require('../config/database')

const ANALYTICS_QUEUE_KEY = 'analytics:queue'

const WORKER_INTERVAL = 5000  // 5 seconds

const BATCH_SIZE = 100

async function processClickQueue() {
  try {
    const queueLength = await redis.llen(ANALYTICS_QUEUE_KEY)

    if (queueLength === 0) return

    console.log(`Analytics worker: processing ${queueLength} clicks`)

    const itemsToProcess = Math.min(queueLength, BATCH_SIZE)
    const rawClicks = await redis.lpop(ANALYTICS_QUEUE_KEY, itemsToProcess)

    if (!rawClicks || rawClicks.length === 0) return

    const clicks = rawClicks.map(raw => JSON.parse(raw))

    const clicksByUrlId = {}

    clicks.forEach(click => {
      if (!clicksByUrlId[click.urlId]) {
        clicksByUrlId[click.urlId] = []
      }
      clicksByUrlId[click.urlId].push(click)
    })

    await prisma.$transaction(async (tx) => {
      for (const [urlId, urlClicks] of Object.entries(clicksByUrlId)) {
        const id = parseInt(urlId)

        await tx.click.createMany({
          data: urlClicks.map(click => ({
            urlId: id,
            userAgent: click.userAgent,
            clickedAt: new Date(click.clickedAt)
          }))
        })

        await tx.url.update({
          where: { id },
          data: {
            clickCount: {
              increment: urlClicks.length
            }
          }
        })
      }
    })

    console.log(`Analytics worker: saved ${clicks.length} clicks to database`)

  } catch (error) {
    console.error('Analytics worker error:', error.message)
  }
}

function startAnalyticsWorker() {
  console.log(`Analytics worker started (runs every ${WORKER_INTERVAL / 1000}s)`)

  setInterval(processClickQueue, WORKER_INTERVAL)

  processClickQueue()
}

module.exports = { startAnalyticsWorker }