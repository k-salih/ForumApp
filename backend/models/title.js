import mongoose from 'mongoose'
import { toJSON } from '../utils/models'
import { v4 } from 'uuid'
const titleSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, default: () => v4() },
    title: { type: String, required: true, unique: true },
  },
  {
    collection: 'titles',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

titleSchema.methods.toJSON = toJSON()

const Title = mongoose.model('Title', titleSchema)

export default Title
