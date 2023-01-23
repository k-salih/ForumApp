import { Router } from 'express'
import Entry from '../models/entry.js'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const entryRouter = Router()

/// GET ALL ENTRIES
entryRouter.get('/', async (req, res) => {
  const entries = await Entry.find({}).populate('user', { username: 1, email: 1 })
  res.json(entries)
})

/// GET ENTRY BY ID
entryRouter.get('/:id', async (req, res) => {
  const entry = await Entry.findById(req.params.id).populate('user', { username: 1, email: 1 })
  entry ? res.json(entry) : res.status(404).end()
})

/// POST NEW ENTRY
const getToken = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

entryRouter.post('/', async (req, res) => {
  const body = req.body
  const token = getToken(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'Invalid or missing token' })
  }

  const user = await User.findById(decodedToken.id)

  const entry = new Entry({
    title: body.title,
    content: body.content,
    user: user._id,
  })

  const savedEntry = await entry.save()

  res.json(savedEntry)
})

/// UPDATE ENTRY
entryRouter.put('/:id', async (req, res) => {
  const entryToUpdate = await Entry.findById(req.params.id)
  const body = req.body
  const token = getToken(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  const user = await User.findById(decodedToken.id)

  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'Invalid or missing token' })
  } else if (entryToUpdate.user.toString() !== user._id.toString()) {
    return res.status(401).json({ error: 'Only the creator can change the entry' })
  }

  const entry = {
    title: body.title,
    content: body.content,
    user: user._id,
    updatedAt: Date.now(),
  }

  const updated = await Entry.findByIdAndUpdate(req.params.id, entry, { new: true, runValidators: true, context: 'query' })
  res.json(updated)
})

/// DELETE ENTRY
entryRouter.delete('/:id', async (req, res) => {
  const entryToDelete = await Entry.findById(req.params.id)

  if (!entryToDelete) {
    return res.status(404).json({ error: 'Entry not found' })
  }

  await Entry.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

export default entryRouter
