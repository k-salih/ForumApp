import mongoose from 'mongoose'

const entrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true, minlength: 3 },
  cretedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Entry = mongoose.model('Entry', entrySchema)

export default Entry
