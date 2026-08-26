const { getAnalytics } = require('../services/analytics.service')

async function getUrlAnalytics(req, res) {
  try {
    const { shortCode } = req.params

    const analytics = await getAnalytics(shortCode)

    if (!analytics) {
      return res.status(404).json({
        success: false,
        error: 'Short URL not found'
      })
    }

    return res.status(200).json({
      success: true,
      data: analytics
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

module.exports = { getUrlAnalytics }