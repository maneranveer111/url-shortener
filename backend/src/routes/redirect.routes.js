const express = require('express')
const router = express.Router()

const { redirectUrl } = require('../controllers/url.controller')

router.get('/:shortCode([A-Za-z0-9]{4, 10})', redirectUrl)

module.exports = router