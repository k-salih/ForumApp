import { Router } from 'express'
import User from '../models/user.js'

const userRouter = Router()

/// GET ALL USERS
userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('entries', { title: 1, content: 1 })
  res.json(users)
})

/// GET USER BY ID
userRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).populate('entries', { title: 1, content: 1 })
  user ? res.json(user) : res.status(404).end()
})

/// POST NEW USER
userRouter.post('/', async (req, res) => {
  const body = req.body

  const user = new User({
    username: body.username,
    email: body.email,
    password: body.password,
  })

  const savedUser = await user.save()

  res.json(savedUser)
})

/// UPDATE USER
userRouter.put('/:id', async (req, res) => {
  const body = req.body

  const user = {
    username: body.username,
    name: body.name,
    password: body.password,
  }

  if (user.password && user.password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' })
  } else if (user.username && user.username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' })
  }

  const updated = await User.findByIdAndUpdate(req.params.id, user, { new: true })
  res.json(updated)
})

/// DELETE USER
userRouter.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id)
  } catch (error) {
    return res.status(404).json({ error: 'User not found' })
  }
  res.status(204).end()
})

export default userRouter
