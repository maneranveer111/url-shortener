const express = require('express')

const router = express.Router()

const { shortenUrl, redirectUrl, getOriginalUrl } = require('../controllers/url.controller')
const rateLimiter = require('../middleware/rateLimiter')

router.post('/shorten', rateLimiter, shortenUrl)
router.get('/original/:shortCode', rateLimiter, getOriginalUrl)

module.exports = router