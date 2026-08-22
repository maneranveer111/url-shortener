function isValidUrl(string) {
  try {
    const url = new URL(string)

    return url.protocol === 'http:' || url.protocol === 'https:'

  } catch (error) {
    return false
  }
}
function isValidCustomCode(code) {
  const regex = /^[a-zA-Z0-9]{3,20}$/
  return regex.test(code)
}

function normalizeUrl(url) {
  return url.trim().replace(/\/+$/, '')
}

module.exports = {
  isValidUrl,
  isValidCustomCode,
  normalizeUrl
}