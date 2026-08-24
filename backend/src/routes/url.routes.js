const express = require('express')

const router = express.Router()

const { shortenUrl, redirectUrl } = require('../controllers/url.controller')
const rateLimiter = require('../middleware/rateLimiter')

router.post('/shorten', rateLimiter, shortenUrl)

module.exports = router