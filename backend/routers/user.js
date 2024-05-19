import { Router } from 'express'
import {
  getAllUsersHandler,
  getUserByIdHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getUserFollowersHandler,
  getUserFollowingHandler,
  followUserHandler,
  unfollowUserHandler,
} from '../handlers/user'
import { authorizeUser } from '../utils/middleware'

const userRouter = Router()

userRouter.get('/', getAllUsersHandler)
userRouter.get('/:id', getUserByIdHandler)
userRouter.post('/', createUserHandler)
userRouter.put('/:id', updateUserHandler)
userRouter.delete('/:id', deleteUserHandler)
userRouter.get('/:id/followers', getUserFollowersHandler)
userRouter.get('/:id/following', getUserFollowingHandler)
userRouter.post('/:id/followers', authorizeUser, followUserHandler)
userRouter.delete('/:id/followers', authorizeUser, unfollowUserHandler)

export default userRouter
