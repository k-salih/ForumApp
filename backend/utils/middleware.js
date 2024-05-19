import logger from './logger.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

export const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
    if (decodedToken) {
      req.user = await User.findById(decodedToken.id)
    }
  }
  next()
}

export const authorizeUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized!' })
  }
  next()
}

export const errorHandler = (error, req, res, next) => {
  logger.error(error)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'MongoServerError') {
    return res.status(400).json({ error })
  }

  next(error)
}
