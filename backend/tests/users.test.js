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
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
