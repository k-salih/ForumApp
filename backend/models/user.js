import mongoose from 'mongoose'
import { toJSON } from '../utils/models'
import { v4 } from 'uuid'

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, default: () => v4() },
    username: { type: String, required: true, unique: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    followers: [{ type: String, ref: 'User' }],
    following: [{ type: String, ref: 'User' }],
  },
  {
    collection: 'users',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

userSchema.methods.toJSON = toJSON()

const User = mongoose.model('User', userSchema)

export default User
