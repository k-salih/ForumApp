import express from 'express'
import config from './utils/config.js'
import logger from './utils/logger.js'
import mongoose from 'mongoose'
import cors from 'cors'
import 'express-async-errors'

import userRouter from './controllers/users.js'
import entryRouter from './controllers/entries.js'
import loginRouter from './controllers/login.js'
import titleRouter from './controllers/titles.js'
import middleware from './utils/middleware.js'

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose.set('strictQuery', false)

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/entries', middleware.userExtractor, entryRouter)
app.use('/api/login', loginRouter)
app.use('/api/titles', titleRouter)

app.use(middleware.errorHandler)

export default app
