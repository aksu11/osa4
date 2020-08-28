const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    "name": "Testaaja1",
    "username": "Test1",
    "adult": true,
    "password": "salainen"
  },
  {
    "name": "Testaaja2",
    "username": "Test2",
    "adult": true,
    "password": "salainen"
  },
  {
    "name": "Testaaja3",
    "username": "Test3",
    "adult": false,
    "password": "salainen"
  }
] 

beforeAll( async () => {
  await User.deleteMany({})
  const userObjects = initialUsers.map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
})

describe('users API-tests', () => {

  test('username is set and it is at least 3 characters', async () => {
    const shortUsername =   {
      "name": "Testaaja1",
      "username": "AS",
      "adult": true,
      "password": "salainen"
    }
    const noUsername = {
      "name": "Testaaja1",
      "adult": true,
      "password": "salainen"
    }
    const usersBefore = await api.get('/api/users')
    await api.post('/api/users').send(shortUsername).expect(400)
    await api.post('/api/users').send(noUsername).expect(400)
    const usersAfter = await api.get('/api/users')
    expect(usersAfter.body.length).toBe(usersBefore.body.length)
  })

  test('password is set and it is at least 3 characters', async () => {
    const shortPassword = {
      "name": "Testaaja1",
      "username": "Test4",
      "adult": true,
      "password": "sa"
    }
    const noPassword = {
      "name": "Testaaja1",
      "username": "Test5",
      "adult": true
    }
    const usersBefore = await api.get('/api/users')
    await api.post('/api/users').send(shortPassword).expect(400)
    await api.post('/api/users').send(noPassword).expect(400)
    const usersAfter = await api.get('/api/users')
    expect(usersAfter.body.length).toBe(usersBefore.body.length)
  })

  test('Username is unique', async () => {
    const user = {
      "name": "Testaaja1",
      "username": "Test1",
      "adult": true,
      "password": "salainen"
    }
    const usersBefore = await api.get('/api/users')
    await api.post('/api/users').send(user).expect(422)
    const usersAfter = await api.get('/api/users')
    expect(usersAfter.body.length).toBe(usersBefore.body.length)
  })

})

afterAll( () => {
  mongoose.connection.close()
})