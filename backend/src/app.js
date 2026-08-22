const express = require('express')

const app = express()

app.use(express.json())

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

module.exports = app