import User from '../models/user'

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

export default {
  initialUsers,
  usersInDb,
}
