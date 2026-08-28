const { createShortUrl, getUrlByShortCode } = require('../services/url.service')
const { trackClick } = require('../services/analytics.service')
const { isValidUrl, isValidCustomCode } = require('../utils/urlValidator')

async function shortenUrl(req, res) {
  try {
    const { url, customCode } = req.body

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      })
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL. Must be a valid http or https URL'
      })
    }

    if (customCode && !isValidCustomCode(customCode)) {
      return res.status(400).json({
        success: false,
        error: 'Custom code must be 3-20 alphanumeric characters only'
      })
    }

    const result = await createShortUrl(url, customCode || null)

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`
    const shortUrl = `${baseUrl}/${result.shortCode}`

    return res.status(201).json({
      success: true,
      shortUrl,
      shortCode: result.shortCode,
      originalUrl: result.originalUrl,
      createdAt: result.createdAt
    })

  } catch (error) {
    if (error.message === 'CUSTOM_CODE_TAKEN') {
      return res.status(409).json({
        success: false,
        error: 'This custom code is already taken. Please choose another.'
      })
    }

    console.error('Error shortening URL:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

async function redirectUrl(req, res) {
  try {
    const { shortCode } = req.params

    const result = await getUrlByShortCode(shortCode)

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Short URL not found'
      })
    }

    trackClick(shortCode, req.headers['user-agent'], result.id)

    return res.redirect(302, result.originalUrl)

  } catch (error) {
    console.error('Error redirecting URL:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

async function getOriginalUrl(req, res) {
  try {
    const { shortCode } = req.params

    const result = await getUrlByShortCode(shortCode)

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Short URL not found'
      })
    }

    return res.status(200).json({
      success: true,
      shortCode,
      originalUrl: result.originalUrl,
      id: result.id
    })
  } catch (error) {
    console.error('Error fetching original URL:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

module.exports = {
  shortenUrl,
  redirectUrl,
  getOriginalUrl
}