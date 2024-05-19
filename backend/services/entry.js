import Entry from '../models/entry.js'
import Title from '../models/title.js'

export const getAllEntries = async () => {
  return await Entry.find({}).populate('user', { username: 1, email: 1 })
}

export const getEntryById = async (id) => {
  const entry = await Entry.findById(id).populate('user', { username: 1, email: 1 })

  if (!entry) {
    throw { status: 404, message: 'Entry not found' }
  }

  return entry
}

export const createEntry = async (entryData, user) => {
  if (entryData.content.length < 5) {
    throw { status: 400, message: 'Content must be at least 5 characters long' }
  }

  const entry = new Entry({
    title: entryData.title,
    content: entryData.content,
    user: user._id,
  })

  const savedEntry = await entry.save()
  const existingTitle = await Title.findOne({ title: entryData.title })

  if (!existingTitle) {
    const title = new Title({ title: entryData.title })
    await title.save()
  }

  await user.save()
  return savedEntry
}

export const updateEntry = async (id, entryData, user) => {
  const entryToUpdate = await Entry.findById(id)

  if (entryToUpdate.user.toString() !== user.id.toString()) {
    throw { status: 401, message: 'Only the creator can change the entry' }
  }

  const entry = {
    title: entryData.title,
    content: entryData.content,
    user: user._id,
    updatedAt: Date.now(),
  }

  return await Entry.findByIdAndUpdate(id, entry, { new: true, runValidators: true, context: 'query' })
}

export const deleteEntry = async (id, user) => {
  const entryToDelete = await Entry.findById(id)

  if (!entryToDelete) {
    throw { status: 404, message: 'Entry not found' }
  }

  if (entryToDelete.user.toString() !== user.id.toString()) {
    throw { status: 401, message: 'Only the creator can delete the entry' }
  }

  await Entry.findByIdAndRemove(id)
}
