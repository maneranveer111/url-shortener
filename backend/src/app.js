const express = require('express')
const cors = require('cors')

const urlRoutes = require('./routes/url.routes')
const analyticsRoutes = require('./routes/analytics.routes')

const app = express()

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) return callback(null, true)

    if (origin.match(/^https:\/\/url-shortener.*\.vercel\.app$/)) {
      return callback(null, true)
    }

    callback(new Error('Not allowed by CORS'))
  },
  credentials: true
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