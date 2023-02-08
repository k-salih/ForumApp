import User from '../models/user'
import request from 'supertest'
import app from '../app'
import mongoose from 'mongoose'
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

  test('login succeeds with correct credentials', async () => {
    const user = helper.initialUsers[0]

    const response = await api
      .post('/api/login')
      .send({ username: user.username, password: user.password })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).toBeDefined()
  })

  test('login fails with wrong password', async () => {
    const user = helper.initialUsers[0]

    const response = await api
      .post('/api/login')
      .send({ username: user.username, password: 'wrongpassword' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('invalid username or password')
  })

  test('login fails with wrong username', async () => {
    const user = helper.initialUsers[0]

    const response = await api
      .post('/api/login')
      .send({ username: 'wrongusername', password: user.password })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('invalid username or password')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
