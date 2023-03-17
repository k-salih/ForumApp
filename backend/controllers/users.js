import { Router } from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'

const userRouter = Router()

/// GET ALL USERS
userRouter.get('/', async (req, res) => {
  const users = await User.find({})
    .populate({
      path: 'entries',
      select: 'title content user updatedAt createdAt',
      populate: { path: 'user', select: 'username' },
    })
    .lean()

  const transformedUsers = users.map((user) => ({
    ...user,
    id: user._id,
    _id: undefined,
    password: undefined,
    entries: user.entries.map((entry) => ({
      ...entry,
      user: {
        ...entry.user,
        id: entry.user._id,
        _id: undefined,
      },
      id: entry._id,
      _id: undefined,
      __v: undefined,
    })),
    __v: undefined,
  }))

  res.json(transformedUsers)
})

/// GET USER BY ID
userRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).populate('entries', { title: 1, content: 1 })
  user ? res.json(user) : res.status(404).end()
})

/// POST NEW USER
userRouter.post('/', async (req, res) => {
  const body = req.body

  if (!body.password) {
    return res.status(400).json({ error: 'Password is required' })
  } else if (body.password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' })
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    body.password = passwordHash
  }

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

  if (body.password && body.password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' })
  } else if (body.password) {
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

/// GET FOLLOWERS OF USER
userRouter.get('/:id/followers', async (req, res) => {
  const user = await User.findById(req.params.id).populate('followers', { username: 1, email: 1 })
  user ? res.json(user.followers) : res.status(404).end()
})

/// GET WHO USER FOLLOWS
userRouter.get('/:id/following', async (req, res) => {
  const user = await User.findById(req.params.id).populate('following', { username: 1, email: 1 })
  user ? res.json(user.following) : res.status(404).end()
})

/// FOLLOW USER
userRouter.post('/:id/followers', async (req, res) => {
  const userToFollow = await User.findById(req.params.id)

  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(req.user.id)

  if (!userToFollow) {
    return res.status(404).json({ error: 'User not found' })
  }

  if (userToFollow.followers.includes(user._id)) {
    return res.status(400).json({ error: 'User already followed' })
  }

  userToFollow.followers = userToFollow.followers.concat(user._id)
  await userToFollow.save()

  user.following = user.following.concat(userToFollow._id)
  await user.save()

  res.status(200).end()
})

/// UNFOLLOW USER
userRouter.delete('/:id/followers', async (req, res) => {
  const userToUnfollow = await User.findById(req.params.id)

  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(req.user.id)

  if (!userToUnfollow) {
    return res.status(404).json({ error: 'User not found' })
  }

  if (!userToUnfollow.followers.includes(user._id)) {
    return res.status(400).json({ error: 'User not followed' })
  }

  userToUnfollow.followers = userToUnfollow.followers.filter((follower) => follower.toString() !== user._id.toString())
  await userToUnfollow.save()

  user.following = user.following.filter((following) => following.toString() !== userToUnfollow._id.toString())
  await user.save()

  res.status(200).end()
})

export default userRouter
