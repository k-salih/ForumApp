import { Router } from 'express'
import userRouter from './user'
import entryRouter from './entry'
import loginRouter from './login'
import titleRouter from './title'
import { userExtractor } from '../utils/middleware'

const apiRouter = Router()

// Setup specific routers with middleware as necessary
apiRouter.use('/users', userExtractor, userRouter)
apiRouter.use('/entries', userExtractor, entryRouter)
apiRouter.use('/login', loginRouter)
apiRouter.use('/titles', titleRouter)

export default apiRouter
