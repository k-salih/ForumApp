import { fetchAllTitles, fetchTitleById } from '../services/title'

export const getAllTitlesHandler = async (req, res) => {
  try {
    const titles = await fetchAllTitles()
    res.json(titles)
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}

export const getTitleByIdHandler = async (req, res) => {
  try {
    const title = await fetchTitleById(req.params.id)
    res.json(title)
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}
