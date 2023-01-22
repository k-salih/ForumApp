import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import { Router } from 'express'

const loginRouter = Router()

loginRouter.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.password)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  res.status(200).send({ token, username: user.username, name: user.name })
})

export default loginRouter
