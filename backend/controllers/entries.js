import { Router } from 'express'
import Entry from '../models/entry.js'

const entryRouter = Router()

/// GET ALL ENTRIES
entryRouter.get('/', async (req, res) => {
  const entries = await Entry.find({}).populate('user', { username: 1, email: 1 })
  res.json(entries)
})

/// GET ENTRY BY ID
entryRouter.get('/:id', async (req, res) => {
  const entry = await Entry.findById(req.params.id).populate('user', { username: 1, email: 1 })
  res.json(entry)
})

/// POST NEW ENTRY
entryRouter.post('/', async (req, res) => {
  const body = req.body

  const entry = new Entry({
    title: body.title,
    content: body.content,
    user: body.user,
  })

  const savedEntry = await entry.save()

  res.json(savedEntry)
})

/// UPDATE ENTRY
entryRouter.put('/:id', async (req, res) => {
  const body = req.body

  const entry = {
    title: body.title,
    content: body.content,
    user: body.user,
    updatedAt: Date.now(),
  }

  const updated = await Entry.findByIdAndUpdate(req.params.id, entry, { new: true })
  res.json(updated)
})

/// DELETE ENTRY
entryRouter.delete('/:id', async (req, res) => {
  await Entry.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

export default entryRouter
