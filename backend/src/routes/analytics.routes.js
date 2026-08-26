const express = require("express")
const router = express.Router()

const { getUrlAnalytics } = require('../controllers/analytics.controller')

router.get('/:shortCode', getUrlAnalytics)
module.exports = router