import mongoose from 'mongoose'
import app from '../app'
import request from 'supertest'

import Title from '../models/title'
import User from '../models/user'
import Entry from '../models/entry'

import helper from './test_helper'

const api = request(app)

describe('when there is initially some titles saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Entry.deleteMany({})
    await Title.deleteMany({})

    for (const title of helper.initialTitles) {
      const titleObject = new Title({ title: title.title })
      await titleObject.save()
    }
  })

  test('all titles are returned, and in json format', async () => {
    const response = await api
      .get('/api/titles')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(helper.initialTitles.length)
    expect(response.body.map((title) => title.title)).toContain('Ankara')
    expect(response.body.map((title) => title.title)).toContain('İstanbul')
  })

  describe('viewing a specific title', () => {
    test('succeeds with a valid id', async () => {
      const titlesAtStart = await helper.titlesInDb()
      const titleToView = {
        ...titlesAtStart[0],
        created_at: titlesAtStart[0].created_at.toISOString(),
        updated_at: titlesAtStart[0].updated_at.toISOString(),
      }

      const resultTitle = await api
        .get(`/api/titles/${titleToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultTitle.body).toEqual(titleToView)
    })

    test('fails with statuscode 404 if title does not exist', async () => {
      const validNonexistingId = '63e61af3843af521b04fd708'
      await api.get(`/api/titles/${validNonexistingId}`).expect(404)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
