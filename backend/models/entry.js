import mongoose from 'mongoose'
import { v4 } from 'uuid'

import { toJSON } from '../utils/models'

const entrySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, default: () => v4() },
    title: { type: String, required: true },
    content: { type: String, required: true, minlength: 3 },
    user: { type: String, ref: 'User' },
  },
  {
    collection: 'entries',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

entrySchema.methods.toJSON = toJSON()

const Entry = mongoose.model('Entry', entrySchema)

export default Entry
