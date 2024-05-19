import { Router } from 'express'
import { loginHandler } from '../handlers/login'

const loginRouter = Router()

loginRouter.post('/', loginHandler)

export default loginRouter
