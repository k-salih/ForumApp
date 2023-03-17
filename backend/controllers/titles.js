import { Router } from 'express'
import Title from '../models/title.js'
import User from '../models/user.js'
import Entry from '../models/entry.js'

const titleRouter = Router()

/// GET ALL TITLES
titleRouter.get('/', async (req, res) => {
  const titles = await Title.find({})
    .populate({
      path: 'entries',
      select: 'title content user createdAt updatedAt',
      populate: { path: 'user', select: 'username' },
    })
    .lean()

  const transformedTitles = titles.map((title) => ({
    ...title,
    id: title._id,
    _id: undefined,
    entries: title.entries.map((entry) => ({
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

  res.json(transformedTitles)
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
