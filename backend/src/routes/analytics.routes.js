const express = require("express")
const router = express.Router()
const rateLimiter = require('../middleware/rateLimiter')

const { getUrlAnalytics } = require('../controllers/analytics.controller')

router.get('/:shortCode', rateLimiter, getUrlAnalytics)
module.exports = router