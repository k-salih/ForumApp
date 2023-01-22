import { Router } from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'

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

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    email: body.email,
    password: passwordHash,
  })

  const savedUser = await user.save()

  res.json(savedUser)
})

/// UPDATE USER
userRouter.put('/:id', async (req, res) => {
  const body = req.body

  if (body.password) {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    body.password = passwordHash
  }

  const user = {
    username: body.username,
    name: body.name,
    password: body.password,
  }

  const updated = await User.findByIdAndUpdate(req.params.id, user, { new: true, runValidators: true, context: 'query' })
  res.json(updated)
})

/// DELETE USER
userRouter.delete('/:id', async (req, res) => {
  const userToDelete = await User.findById(req.params.id)

  if (!userToDelete) {
    return res.status(404).json({ error: 'User not found' })
  }

  await User.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

export default userRouter
