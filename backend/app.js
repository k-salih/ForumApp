import express from 'express'
import config from './utils/config.js'
import logger from './utils/logger.js'
import mongoose from 'mongoose'
import cors from 'cors'
import 'express-async-errors'

import apiRouter from './routers/index.js'
import { errorHandler } from './utils/middleware.js'

const app = express()

logger.info('Connecting to', config.MONGODB_URI)

mongoose.set('strictQuery', false)

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

// Use the centralized API router
app.use('/api', apiRouter)

// Error handling middleware
app.use(errorHandler)
export default app
