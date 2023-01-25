import mongoose from 'mongoose'

const titleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  entries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Entry' }],
})

titleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Title = mongoose.model('Title', titleSchema)

export default Title
