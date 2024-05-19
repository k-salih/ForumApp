import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserFollowers,
  getUserFollowing,
  followUser,
  unfollowUser,
} from '../services/user'

export const getAllUsersHandler = async (req, res) => {
  try {
    const users = await getAllUsers()
    res.json(users)
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}

export const getUserByIdHandler = async (req, res) => {
  try {
    const user = await getUserById(req.params.id)
    res.json(user)
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}

export const createUserHandler = async (req, res) => {
  try {
    const savedUser = await createUser(req.body)
    res.json(savedUser)
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}

export const updateUserHandler = async (req, res) => {
  try {
    const updated = await updateUser(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}

export const deleteUserHandler = async (req, res) => {
  try {
    await deleteUser(req.params.id)
    res.status(204).end()
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}

export const getUserFollowersHandler = async (req, res) => {
  try {
    const followers = await getUserFollowers(req.params.id)
    followers ? res.json(followers) : res.status(404).end()
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}

export const getUserFollowingHandler = async (req, res) => {
  try {
    const following = await getUserFollowing(req.params.id)
    following ? res.json(following) : res.status(404).end()
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}

export const followUserHandler = async (req, res) => {
  try {
    await followUser(req.user.id, req.params.id)
    res.status(200).end()
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}

export const unfollowUserHandler = async (req, res) => {
  try {
    console.log('req.user.id', req.user.id)
    console.log('req.params.id', req.params.id)
    await unfollowUser(req.user.id, req.params.id)
    res.status(200).end()
  } catch (err) {
    res.status(err.status).json({ error: err.message })
  }
}
