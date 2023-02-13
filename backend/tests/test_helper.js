import User from '../models/user'
import Entry from '../models/entry'
import Title from '../models/title'
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

const initialEntries = [
  {
    title: 'Entry 1',
    content: 'Entry 1 Content',
  },
  {
    title: 'Entry 2',
    content: 'Entry 2 Content',
  },
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const entriesInDb = async () => {
  const entries = await Entry.find({}).populate('user', { username: 1, email: 1 })
  return entries.map((entry) => entry.toJSON())
}

const titlesInDb = async () => {
  const entries = await Title.find({})
  return entries.map((entry) => entry.title)
}

const passwordHashGenerator = async (password) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  return passwordHash
}

export default {
  initialUsers,
  initialEntries,
  usersInDb,
  entriesInDb,
  titlesInDb,
  passwordHashGenerator,
}
