require('dotenv').config()
const redis = require('./src/config/redis')

async function clearCache() {

  const keys = await redis.keys('url:*')
  
  console.log(`Found ${keys.length} cached URL keys:`, keys)
  
  if (keys.length > 0) {
    await redis.del(...keys)
    console.log('All URL cache keys deleted!')
  }
  
  await redis.quit()
  process.exit(0)
}

clearCache()