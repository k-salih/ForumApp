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
  res.json(user)
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
    passwordHash: body.passwordHash,
  }

  const updated = await User.findByIdAndUpdate(req.params.id, user, { new: true })
  res.json(updated)
})

/// DELETE USER
userRouter.delete('/:id', async (req, res) => {
  await User.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

export default userRouter
