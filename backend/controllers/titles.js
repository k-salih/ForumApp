import { Router } from 'express'
import Title from '../models/title.js'

const titleRouter = Router()

/// GET ALL TITLES
titleRouter.get('/', async (req, res) => {
  const titles = await Title.find({}).populate({
    path: 'entries',
    select: 'title content user',
    populate: { path: 'user', select: 'username' },
  })

  res.json(titles)
})

/// GET TITLE BY ID

titleRouter.get('/:id', async (req, res) => {
  const title = await Title.findById(req.params.id).populate({
    path: 'entries',
    select: 'title content user',
    populate: { path: 'user', select: 'username' },
  })

  title ? res.json(title) : res.status(404).end()
})

export default titleRouter
