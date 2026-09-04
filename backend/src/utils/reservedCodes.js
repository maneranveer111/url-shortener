const RESERVED_CODES = new Set([
    'api', 'analytics', 'shorten', 'original',
    'health', 'login', 'admin', 'docs', 'favicon'
])

function isReserved(code) {
    return RESERVED_CODES.has(String(code).toLowerCase())
}

module.exports = { RESERVED_CODES, isReserved }
