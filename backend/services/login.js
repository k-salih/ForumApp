import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const authenticateUser = async (username, password) => {
  const user = await User.findOne({ username })
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password)

  if (!(user && passwordCorrect)) {
    throw new Error('invalid username or password')
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '24h' })

  return { token, username: user.username, name: user.name }
}
