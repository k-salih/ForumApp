import { Router } from 'express'
import Entry from '../models/entry.js'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import Title from '../models/title.js'

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

entryRouter.post('/', async (req, res) => {
  const body = req.body

  if (!req.user) {
    return res.status(401).json({ error: 'Invalid or missing token' })
  }

  const user = req.user

  const entry = new Entry({
    title: body.title,
    content: body.content,
    user: user._id,
  })

  const savedEntry = await entry.save()

  const existingTitle = await Title.findOne({ name: req.body.title })

  if (!existingTitle) {
    const title = new Title({ name: req.body.title })
    title.entries = title.entries.concat(savedEntry._id)
    await title.save()
  } else {
    existingTitle.entries = existingTitle.entries.concat(savedEntry._id)
    await existingTitle.save()
  }

  user.entries = user.entries.concat(savedEntry._id)
  await user.save()

  res.json(savedEntry)
})

/// UPDATE ENTRY
entryRouter.put('/:id', async (req, res) => {
  const entryToUpdate = await Entry.findById(req.params.id)
  const body = req.body

  if (!req.user) {
    return res.status(401).json({ error: 'Invalid or missing token' })
  } else if (entryToUpdate.user.toString() !== req.user.id.toString()) {
    return res.status(401).json({ error: 'Only the creator can change the entry' })
  }

  const user = req.user

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

  if (!req.user) {
    return res.status(401).json({ error: 'Invalid or missing token' })
  } else if (!entryToDelete) {
    return res.status(404).json({ error: 'Entry not found' })
  } else if (entryToDelete.user.toString() !== req.user.id.toString()) {
    return res.status(401).json({ error: 'Only the creator can delete the entry' })
  }

  await Entry.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

export default entryRouter
