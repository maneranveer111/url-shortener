const CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const BASE = CHARACTERS.length // 62

function encode(num) {
  if (num === 0) return CHARACTERS[0]

  let shortCode = ''

  while (num > 0) {
    const remainder = num % BASE      // Get remainder (0 to 61)
    shortCode = CHARACTERS[remainder] + shortCode  // Map to character, add to front
    num = Math.floor(num / BASE)      // Reduce num by dividing by 62
  }

  return shortCode
}

function decode(shortCode) {
  let num = 0

  for (let i = 0; i < shortCode.length; i++) {
    const position = CHARACTERS.indexOf(shortCode[i])
     num = num * BASE + position
  }

  return num
}


function generateRandomCode(length = 6) {
  let result = ''

  for (let i = 0; i < length; i++) {
    
    const randomIndex = Math.floor(Math.random() * BASE)
    result += CHARACTERS[randomIndex]
  }

  return result
}

module.exports = {
  encode,
  decode,
  generateRandomCode
}