import User from '../models/user'
import bcrypt from 'bcrypt'

const initialUsers = [
  {
    username: 'testuser1',
    email: 'testuser1@gmail.com',
    password: 'testuser1',
  },
  {
    username: 'testuser2',
    email: 'testuser2@gmail.com',
    password: 'testuser2',
  },
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const passwordHashGenerator = async (password) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  return passwordHash
}

export default {
  initialUsers,
  usersInDb,
  passwordHashGenerator,
}
