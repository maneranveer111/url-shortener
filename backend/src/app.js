const express = require('express')
const cors = require('cors')

const urlRoutes = require('./routes/url.routes')
const analyticsRoutes = require('./routes/analytics.routes')

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}))

app.use(express.json())

app.use('/api', urlRoutes)

app.use('/api/analytics', analyticsRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'URL Shortener API is running',
    status: 'ok'
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

const { redirectUrl } = require('./controllers/url.controller')
app.get('/:shortCode', redirectUrl)

module.exports = app