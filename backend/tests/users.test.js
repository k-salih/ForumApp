import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app'
import User from '../models/user'
import bcrypt from 'bcrypt'

import helper from './test_helper'

const api = request(app)

describe('When there are some users saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
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

      const resultUser = await api
        .get(`/api/users/${userToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultUser.body).toEqual(userToView)
    })

    test('fails with statuscode 404 if user does not exist', async () => {
      const validNonexistingId = '63dd1e990793eabf876854fb'

      await api.get(`/api/users/${validNonexistingId}`).expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      const response = await api.get(`/api/users/${invalidId}`).expect(400)

      expect(response.body.error).toContain('malformatted id')
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
      expect(response.body.entries).toEqual([])
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
})

afterAll(async () => {
  await mongoose.connection.close()
})
