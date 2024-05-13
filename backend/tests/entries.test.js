import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app'
import helper from './test_helper'
import User from '../models/user'
import Entry from '../models/entry'
import Title from '../models/title'

const api = request(app)

describe('When there is a logged in user who has an entry', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Entry.deleteMany({})
    await Title.deleteMany({})

    for (const user of helper.initialUsers) {
      const passwordHash = await helper.passwordHashGenerator(user.password)
      const userObject = await new User({ ...user, password: passwordHash })
      await userObject.save()
    }

    const userObject = await User.findOne({ username: 'testuser1' })

    for (const entry of helper.initialEntries) {
      const entryObject = await new Entry({ ...entry, user: userObject._id })
      await entryObject.save()
      const titleObject = await new Title({ title: entry.title })
      await titleObject.save()
    }
  })

  test('all entries are returned', async () => {
    const response = await api
      .get('/api/entries')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(helper.initialEntries.length)
  })

  describe('viewing a specific entry', () => {
    test('succeeds with a valid id', async () => {
      const entriesAtStart = await helper.entriesInDb()
      const entryToView = entriesAtStart[0]

      const resultEntry = await api
        .get(`/api/entries/${entryToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultEntry.body.title).toEqual(entryToView.title)
      expect(resultEntry.body.content).toEqual(entryToView.content)
    })

    test('fails with statuscode 404 if entry does not exist', async () => {
      const entries = await helper.entriesInDb()
      const entry = entries[0]
      await Entry.findByIdAndRemove(entry.id)

      await api.get(`/api/entries/${entry.id}`).expect(404)
    })
  })

  describe('creation of a new entry', () => {
    test('succeeds if logged in user submits a valid entry', async () => {
      const usersAtStart = await helper.usersInDb()
      const entriesAtStart = await helper.entriesInDb()
      const user = usersAtStart[0]

      const loginCredentials = {
        username: user.username,
        password: 'testuser1',
      }

      const loginResponse = await api
        .post('/api/login')
        .send(loginCredentials)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token

      const newEntry = {
        title: 'New Entry',
        content: 'New Entry Content',
      }

      await api
        .post('/api/entries')
        .send(newEntry)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const entriesAtEnd = await helper.entriesInDb()
      expect(entriesAtEnd).toHaveLength(entriesAtStart.length + 1)

      const contents = entriesAtEnd.map((entry) => entry.content)
      expect(contents).toContain('New Entry Content')
    })

    test('fails if logged in user submits an invalid entry', async () => {
      const usersAtStart = await helper.usersInDb()
      const entriesAtStart = await helper.entriesInDb()
      const user = usersAtStart[0]

      const loginCredentials = {
        username: user.username,
        password: 'testuser1',
      }

      const loginResponse = await api
        .post('/api/login')
        .send(loginCredentials)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token

      const newEntry = {
        title: 'New Entry',
        content: 'Ne',
      }

      await api.post('/api/entries').send(newEntry).set('Authorization', `bearer ${token}`).expect(400)
    })

    test('fails if user is not logged in', async () => {
      const entriesAtStart = await helper.entriesInDb()

      const newEntry = {
        title: 'New Entry',
        content: 'New Entry Content',
      }

      const response = await api.post('/api/entries').send(newEntry).expect(401)

      expect(response.body.error).toContain('Invalid or missing token')
    })

    test('succeds while posting a new entry to an existing title', async () => {
      const usersAtStart = await helper.usersInDb()
      const entriesAtStart = await helper.entriesInDb()
      const titlesAtStart = await helper.titlesInDb()
      const user = usersAtStart[0]

      const loginCredentials = {
        username: user.username,
        password: 'testuser1',
      }

      const loginResponse = await api
        .post('/api/login')
        .send(loginCredentials)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token

      const newEntry = {
        title: 'Entry 1',
        content: 'New Entry Content',
      }

      await api
        .post('/api/entries')
        .send(newEntry)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const entriesAtEnd = await helper.entriesInDb()
      expect(entriesAtEnd).toHaveLength(entriesAtStart.length + 1)

      const contents = entriesAtEnd.map((entry) => entry.content)
      expect(contents).toContain('New Entry Content')

      const titlesAtEnd = await helper.titlesInDb()
      expect(titlesAtEnd).toHaveLength(titlesAtStart.length)
    })
  })

  describe('updating an entry', () => {
    test('succeeds if its creator updates the entry', async () => {
      const entriesAtStart = await helper.entriesInDb()
      const entryToUpdate = entriesAtStart[0]

      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]

      const loginCredentials = {
        username: user.username,
        password: 'testuser1',
      }

      const loginResponse = await api
        .post('/api/login')
        .send(loginCredentials)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token

      const updatedEntry = {
        title: 'Updated Entry',
        content: 'Updated Entry Content',
      }

      await api
        .put(`/api/entries/${entryToUpdate.id}`)
        .send(updatedEntry)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const entriesAtEnd = await helper.entriesInDb()

      expect(entriesAtStart).toContain(entryToUpdate)
      expect(entriesAtEnd).not.toContain(entryToUpdate)
    })

    test('fails if user is not logged in', async () => {
      const entriesAtStart = await helper.entriesInDb()
      const entryToUpdate = entriesAtStart[0]

      const updatedEntry = {
        title: 'Updated Entry',
        content: 'Updated Entry Content',
      }

      const response = await api.put(`/api/entries/${entryToUpdate.id}`).send(updatedEntry).expect(401)
      expect(response.body.error).toContain('Invalid or missing token')
    })

    test('fails if logged in user updates an entry that is not theirs', async () => {
      const entriesAtStart = await helper.entriesInDb()
      const entryToUpdate = entriesAtStart[0]

      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[1]

      const loginCredentials = {
        username: user.username,
        password: 'testuser2',
      }

      const loginResponse = await api
        .post('/api/login')
        .send(loginCredentials)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token

      const updatedEntry = {
        title: 'Updated Entry',
        content: 'Updated Entry Content',
      }

      const response = await api
        .put(`/api/entries/${entryToUpdate.id}`)
        .send(updatedEntry)
        .set('Authorization', `bearer ${token}`)
        .expect(401)

      expect(response.body.error).toContain('Only the creator can change the entry')
    })
  })

  describe('deletion of an entry', () => {
    test('succeeds if its creator deletes the entry', async () => {
      const entriesAtStart = await helper.entriesInDb()
      const entrToDelete = entriesAtStart[0]

      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]

      const loginCredentials = {
        username: user.username,
        password: 'testuser1',
      }

      const loginResponse = await api
        .post('/api/login')
        .send(loginCredentials)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token

      await api.delete(`/api/entries/${entrToDelete.id}`).set('Authorization', `bearer ${token}`).expect(204)

      const entriesAtEnd = await helper.entriesInDb()
      expect(entriesAtEnd).toHaveLength(entriesAtStart.length - 1)
    })

    test('fails if user is not logged in', async () => {
      const entriesAtStart = await helper.entriesInDb()
      const entrToDelete = entriesAtStart[0]

      const response = await api.delete(`/api/entries/${entrToDelete.id}`).expect(401)
      expect(response.body.error).toContain('Invalid or missing token')
    })

    test('fails if entry does not exist', async () => {
      const entriesAtStart = await helper.entriesInDb()
      const entrToDelete = entriesAtStart[0]

      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]

      const loginCredentials = {
        username: user.username,
        password: 'testuser1',
      }

      const loginResponse = await api
        .post('/api/login')
        .send(loginCredentials)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token

      await Entry.findByIdAndRemove(entrToDelete.id)

      const response = await api.delete(`/api/entries/${entrToDelete.id}`).set('Authorization', `bearer ${token}`).expect(404)
      expect(response.body.error).toContain('Entry not found')
    })

    test('fails if logged in user deletes an entry that is not theirs', async () => {
      const entriesAtStart = await helper.entriesInDb()
      const entryToDelete = entriesAtStart[0]

      const usersAtStart = await helper.usersInDb()

      const user = usersAtStart[1]

      const loginCredentials = {
        username: user.username,
        password: 'testuser2',
      }

      const loginResponse = await api
        .post('/api/login')
        .send(loginCredentials)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token

      const response = await api.delete(`/api/entries/${entryToDelete.id}`).set('Authorization', `bearer ${token}`).expect(401)
      expect(response.body.error).toContain('Only the creator can delete the entry')
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
