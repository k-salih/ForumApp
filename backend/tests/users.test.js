import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app'
import User from '../models/user'

import helper from './test_helper'

const api = request(app)

describe('When there are some users saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    for (const user of helper.initialUsers) {
      const passwordHash = await helper.passwordHashGenerator(user.password)
      const userObject = await new User({ ...user, password: passwordHash })
      await userObject.save()
    }
  })

  test('all users are returned with proper format', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialUsers.length)
    expect(response.body[0].id).toBeDefined()
  })

  describe('viewing a specific user', () => {
    test('succeeds with a valid id', async () => {
      const usersAtStart = await helper.usersInDb()

      const userToView = usersAtStart[0]
      console.log('userToView', userToView)

      const resultUser = await api
        .get(`/api/users/${userToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      console.log('resultUser', resultUser.body)

      expect(resultUser.body.username).toBe(userToView.username)
    })

    test('fails with statuscode 404 if user does not exist', async () => {
      const validNonexistingId = '63dd1e990793eabf876854fb'

      await api.get(`/api/users/${validNonexistingId}`).expect(404)
    })
  })

  describe('user creation', () => {
    test('succeeds if contents are valid', async () => {
      const userToCreate = {
        username: 'testuser3',
        email: 'testuser3@gmail.com',
        password: 'testuser3',
      }

      const response = await api
        .post('/api/users')
        .send(userToCreate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.id).toBeDefined()
      expect(response.body.username).toBe(userToCreate.username)
      expect(response.body.email).toBe(userToCreate.email)
      expect(response.body.password).not.toBe(userToCreate.password)
      expect(response.body.followers).toEqual([])
      expect(response.body.following).toEqual([])
    })

    test('fails if password is not entered', async () => {
      const userToCreate = {
        username: 'testuser3',
        email: 'testuser3@gmail.com',
      }

      const response = await api
        .post('/api/users')
        .send(userToCreate)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.body.error).toContain('Password is required')
    })

    test('fails if password is less than 6 characters', async () => {
      const userToCreate = {
        username: 'testuser3',
        email: 'testuser3@gmail.com',
        password: 'test',
      }

      const response = await api
        .post('/api/users')
        .send(userToCreate)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.body.error).toContain('Password must be at least 6 characters long')
    })

    test('fails with status code 400 if username is invalid', async () => {
      const userToCreate = {
        username: 'te',
        email: 'testuser3@gmail.com',
        password: 'test21',
      }

      const response = await api
        .post('/api/users')
        .send(userToCreate)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('user deletion', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const usersAtStart = await helper.usersInDb()
      const userToDelete = usersAtStart[0]

      await api.delete(`/api/users/${userToDelete.id}`).expect(204)

      const usersAtEnd = await helper.usersInDb()

      expect(usersAtEnd).toHaveLength(helper.initialUsers.length - 1)

      const usernames = usersAtEnd.map((u) => u.username)

      expect(usernames).not.toContain(userToDelete.username)
    })

    test('fails with status code 404 if user is not found', async () => {
      const validNonexistingId = '63dd1e990793eabf876854fb'

      const response = await api.delete(`/api/users/${validNonexistingId}`).expect(404)
      expect(response.body.error).toContain('User not found')
    })
  })

  describe('user update', () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const usersAtStart = await helper.usersInDb()
      const userToUpdate = usersAtStart[0]

      const updatedUser = {
        ...userToUpdate,
        username: 'updatedusername',
      }

      await api.put(`/api/users/${userToUpdate.id}`).send(updatedUser).expect(200)

      const usersAtEnd = await helper.usersInDb()

      expect(usersAtEnd).toHaveLength(helper.initialUsers.length)

      const usernames = usersAtEnd.map((u) => u.username)

      expect(usernames).toContain(updatedUser.username)
      expect(usernames).not.toContain(userToUpdate.username)
    })

    test('succeeds when updating password', async () => {
      const usersAtStart = await helper.usersInDb()
      const userToUpdate = usersAtStart[0]

      const updatedUser = {
        ...userToUpdate,
        password: 'updatedpassword',
      }

      await api.put(`/api/users/${userToUpdate.id}`).send(updatedUser).expect(200)
    })

    test('fails with status code 400 if password is less than 6 characters', async () => {
      const usersAtStart = await helper.usersInDb()
      const userToUpdate = usersAtStart[0]

      const updatedUser = {
        ...userToUpdate,
        password: 'test',
      }

      const response = await api
        .put(`/api/users/${userToUpdate.id}`)
        .send(updatedUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      expect(response.body.error).toContain('Password must be at least 6 characters long')
    })
  })

  test('all followers are returned', async () => {
    const usersInDb = await helper.usersInDb()
    const user = usersInDb[0]

    const response = await api.get(`/api/users/${user.id}/followers`).expect(200)

    expect(response.body).toHaveLength(user.followers.length)
  })

  test('getting followers of non-existing user returns 404', async () => {
    const validNonexistingId = '63dd1e990793eabf876854fb'

    const response = await api.get(`/api/users/${validNonexistingId}/followers`).expect(404)
  })

  test('all following are returned', async () => {
    const usersInDb = await helper.usersInDb()
    const user = usersInDb[0]

    const response = await api.get(`/api/users/${user.id}/following`).expect(200)

    expect(response.body).toHaveLength(user.following.length)
  })

  test('getting following of non-existing user returns 404', async () => {
    const validNonexistingId = '63dd1e990793eabf876854fb'

    const response = await api.get(`/api/users/${validNonexistingId}/following`).expect(404)
  })

  describe('user follow', () => {
    test('succeeds with status code 200 if id is valid and user is logged in', async () => {
      const usersAtStart = await helper.usersInDb()
      const userToFollow = usersAtStart[1]
      const user = usersAtStart[0]
      const loginCredentials = {
        username: user.username,
        password: 'testuser1',
      }

      const loginResponse = await api.post('/api/login').send(loginCredentials).expect(200)

      const response = await api
        .post(`/api/users/${userToFollow.id}/followers`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .expect(200)

      const usersAtEnd = await helper.usersInDb()

      expect(usersAtEnd[1].followers).toHaveLength(userToFollow.followers.length + 1)
      expect(usersAtEnd[0].following).toHaveLength(user.following.length + 1)
    })

    test('fails with status code 401 if user is not logged in', async () => {
      const usersAtStart = await helper.usersInDb()
      const userToFollow = usersAtStart[1]

      const response = await api.post(`/api/users/${userToFollow.id}/followers`).expect(401)

      const usersAtEnd = await helper.usersInDb()

      expect(usersAtEnd[1].followers).toHaveLength(userToFollow.followers.length)

      expect(response.body.error).toContain('Unauthorized!')
    })

    test('fails with status code 404 if user to follow is not found', async () => {
      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]
      const loginCredentials = {
        username: user.username,
        password: 'testuser1',
      }

      const loginResponse = await api.post('/api/login').send(loginCredentials).expect(200)

      const validNonexistingId = '63dd1e990793eabf876854fb'

      const response = await api
        .post(`/api/users/${validNonexistingId}/followers`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .expect(404)

      expect(response.body.error).toContain('User not found')
    })

    test('fails with status code 400 if user already followed', async () => {
      const usersAtStart = await helper.usersInDb()
      const userToFollow = usersAtStart[1]
      const user = usersAtStart[0]
      const loginCredentials = {
        username: user.username,
        password: 'testuser1',
      }

      const loginResponse = await api.post('/api/login').send(loginCredentials).expect(200)

      await api
        .post(`/api/users/${userToFollow.id}/followers`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .expect(200)

      const response = await api
        .post(`/api/users/${userToFollow.id}/followers`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .expect(400)

      expect(response.body.error).toContain('User already followed')
    })
  })

  describe('user unfollow', () => {
    test('succeeds with status code 200 if id is valid and user is logged in', async () => {
      const usersAtStart = await helper.usersInDb()
      const userToUnfollow = usersAtStart[1]
      const user = usersAtStart[0]

      const loginCredentials = {
        username: user.username,
        password: 'testuser1',
      }

      const loginResponse = await api.post('/api/login').send(loginCredentials).expect(200)

      await api
        .post(`/api/users/${userToUnfollow.id}/followers`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .expect(200)

      const response = await api
        .delete(`/api/users/${userToUnfollow.id}/followers`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .expect(200)

      const usersAtEnd = await helper.usersInDb()

      expect(usersAtEnd[1].followers).toEqual([])
      expect(usersAtEnd[0].following).toEqual([])
    })

    test('fails with status code 401 if user is not logged in', async () => {
      const usersAtStart = await helper.usersInDb()
      const userToUnfollow = usersAtStart[1]

      const response = await api.delete(`/api/users/${userToUnfollow.id}/followers`).expect(401)

      const usersAtEnd = await helper.usersInDb()

      expect(usersAtEnd[1].followers).toHaveLength(userToUnfollow.followers.length)

      expect(response.body.error).toContain('Unauthorized!')
    })

    test('fails with status code 404 if user to unfollow is not found', async () => {
      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]
      const loginCredentials = {
        username: user.username,
        password: 'testuser1',
      }

      const loginResponse = await api.post('/api/login').send(loginCredentials).expect(200)

      const validNonexistingId = '63dd1e990793eabf876854fb'

      const response = await api
        .delete(`/api/users/${validNonexistingId}/followers`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .expect(404)

      expect(response.body.error).toContain('User not found')
    })

    test('fails with status code 400 if user is not followed', async () => {
      const usersAtStart = await helper.usersInDb()
      const userToUnfollow = usersAtStart[1]
      const user = usersAtStart[0]
      const loginCredentials = {
        username: user.username,
        password: 'testuser1',
      }

      const loginResponse = await api.post('/api/login').send(loginCredentials).expect(200)

      const response = await api
        .delete(`/api/users/${userToUnfollow.id}/followers`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .expect(400)

      expect(response.body.error).toContain('User not followed')
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
