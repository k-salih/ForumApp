import User from '../models/user.js'
import bcrypt from 'bcrypt'

export const getAllUsers = async () => {
  return await User.find({})
}

export const getUserById = async (id) => {
  const user = await User.findById(id)
  if (!user) {
    throw { status: 404, message: 'User not found' }
  }
  return user
}

export const createUser = async (userData) => {
  if (!userData.password) {
    throw { status: 400, message: 'Password is required' }
  }

  if (userData.password?.length < 6) {
    throw { status: 400, message: 'Password must be at least 6 characters long' }
  }

  if (userData.username?.length < 3) {
    throw { status: 400, message: 'Username must be at least 3 characters long' }
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(userData.password, saltRounds)
  const newUser = new User({
    username: userData.username,
    email: userData.email,
    password: passwordHash,
  })
  return await newUser.save()
}

export const updateUser = async (id, userData) => {
  if (!userData.password || userData.password.length < 6) {
    throw { status: 400, message: 'Password must be at least 6 characters long' }
  }

  const saltRounds = 10
  userData.password = await bcrypt.hash(userData.password, saltRounds)

  return await User.findByIdAndUpdate(id, userData, { new: true, runValidators: true, context: 'query' })
}

export const deleteUser = async (id) => {
  const user = await User.findById(id)
  if (!user) {
    throw { status: 404, message: 'User not found' }
  }
  await user.remove()
  return user
}

export const getUserFollowers = async (id) => {
  const user = await User.findById(id).populate('followers', { username: 1, email: 1 })
  return user ? user.followers : null
}

export const getUserFollowing = async (id) => {
  const user = await User.findById(id).populate('following', { username: 1, email: 1 })
  return user ? user.following : null
}

export const followUser = async (userId, targetUserId) => {
  const userToFollow = await User.findById(targetUserId)

  if (!userToFollow) {
    throw { status: 404, message: 'User not found' }
  }

  if (userToFollow.followers.includes(userId)) {
    throw { status: 400, message: 'User already followed' }
  }

  const user = await User.findById(userId)

  userToFollow.followers.push(userId)
  await userToFollow.save()

  user.following.push(targetUserId)
  await user.save()
}

export const unfollowUser = async (userId, targetUserId) => {
  const userToUnfollow = await User.findById(targetUserId)

  if (!userToUnfollow) {
    throw { status: 404, message: 'User not found' }
  }

  if (!userToUnfollow.followers.includes(userId)) {
    throw { status: 400, message: 'User not followed' }
  }

  const user = await User.findById(userId)

  userToUnfollow.followers = userToUnfollow.followers.filter((follower) => follower !== userId)
  await userToUnfollow.save()

  user.following = user.following.filter((following) => following !== targetUserId)
  await user.save()
}
