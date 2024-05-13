import { Router } from 'express'
import Title from '../models/title.js'
import User from '../models/user.js'
import Entry from '../models/entry.js'

const titleRouter = Router()

/// GET ALL TITLES
titleRouter.get('/', async (req, res) => {
  const titles = await Title.find({}).lean()

  res.json(titles)
})

/// GET TITLE BY ID

titleRouter.get('/:id', async (req, res) => {
  const title = await Title.findById(req.params.id)

  title ? res.json(title) : res.status(404).end()
})

export default titleRouter
