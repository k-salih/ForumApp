import { getAllEntries, getEntryById, createEntry, updateEntry, deleteEntry } from '../services/entry'

export const getEntriesHandler = async (req, res) => {
  try {
    const entries = await getAllEntries()
    res.json(entries)
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}

export const getEntryByIdHandler = async (req, res) => {
  try {
    const entry = await getEntryById(req.params.id)
    res.json(entry)
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}

export const createEntryHandler = async (req, res) => {
  try {
    const user = req.user

    const savedEntry = await createEntry(req.body, user)
    res.json(savedEntry)
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}

export const updateEntryHandler = async (req, res) => {
  try {
    const updated = await updateEntry(req.params.id, req.body, req.user)
    res.json(updated)
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}

export const deleteEntryHandler = async (req, res) => {
  try {
    await deleteEntry(req.params.id, req.user)
    res.status(204).end()
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}
