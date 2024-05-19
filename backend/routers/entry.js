import { Router } from 'express'
import {
  getEntriesHandler,
  getEntryByIdHandler,
  createEntryHandler,
  updateEntryHandler,
  deleteEntryHandler,
} from '../handlers/entry.js'
import { authorizeUser } from '../utils/middleware.js'
const entryRouter = Router()

entryRouter.get('/', getEntriesHandler)
entryRouter.get('/:id', getEntryByIdHandler)
entryRouter.post('/', authorizeUser, createEntryHandler)
entryRouter.put('/:id', authorizeUser, updateEntryHandler)
entryRouter.delete('/:id', authorizeUser, deleteEntryHandler)

export default entryRouter
