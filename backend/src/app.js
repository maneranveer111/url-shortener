const express = require('express')
const urlRoutes = require('./routes/url.routes')

const app = express()

app.use(express.json())

app.use('/api', urlRoutes)

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