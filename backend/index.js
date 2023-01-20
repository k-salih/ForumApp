import app from './app.js'
import config from './utils/config.js'
import logger from './utils/logger.js'

app.get('/', (req, res) => {
  res.send('Forum Salih')
})

app.listen(3000, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
