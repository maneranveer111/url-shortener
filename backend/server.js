require('dotenv').config()

const app = require('./src/app')
const redis = require('./src/config/redis')
const prisma = require('./src/config/database')
const { startAnalyticsWorker } = require('./src/workers/analyticsWorker')

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    await prisma.$connect()
    console.log('Database connected successfully')

    startAnalyticsWorker()

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV}`)
      console.log(`Visit http://localhost:${PORT}`)
    })

  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

async function shutdown() {
  console.log('\nShutting down gracefully...')
  try {
    await prisma.$disconnect()
    await redis.quit()
  } catch (err) {
    console.error('Error during shutdown:', err)
  } finally {
    process.exit(0)
  }
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

startServer()
