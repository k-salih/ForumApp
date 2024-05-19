import Title from '../models/title.js'

export const fetchAllTitles = async () => {
  return await Title.find({}).lean()
}

export const fetchTitleById = async (id) => {
  const title = await Title.findById(id)

  if (!title) {
    throw { status: 404, message: 'Title not found' }
  }

  return title
}
