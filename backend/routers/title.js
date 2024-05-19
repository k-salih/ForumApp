import { Router } from 'express'
import { getAllTitlesHandler, getTitleByIdHandler } from '../handlers/title'

const titleRouter = Router()

titleRouter.get('/', getAllTitlesHandler)
titleRouter.get('/:id', getTitleByIdHandler)

export default titleRouter
