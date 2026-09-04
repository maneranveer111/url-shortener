const express = require('express')
const router = express.Router()

const { redirectUrl } = require('../controllers/url.controller')

function validateShortCode(req, res, next) {
  const { shortCode } = req.params

  if (!/^[A-Za-z0-9]{1,12}$/.test(shortCode)) {
    return res.status(404).json({ error: 'Not found' })
  }

  next()
}

router.get('/:shortCode', validateShortCode, redirectUrl)

module.exports = router
