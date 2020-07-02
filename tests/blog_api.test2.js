
const supertest = require('supertest')
const Blog = require('../models/blog')
const { app, server } = require('../index')
const api = supertest(app)
const helper = require('./test_helper')

describe.skip('get all', async () => {
  test.skip('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe.skip('addition of a new blog', async () => {

  test('blogs are returned as json', async () => {
    const validBlog = new Blog({
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0
    })
    const blogsBefore = await helper.blogsInDb()
    await api
      .post('/api/blogs')
      .send(validBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length+1)
    expect(blogsAfter).toContainEqual(Blog.format(validNote))
  })

  test('correction to empty likes', () => {
    const withoutLikes = new Blog({
      title : "TDD harms architecture",
      author : "Robert",
      url : "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
    })
    return api
      .post('/api/blogs')
      .send(withoutLikes)
      .then(res => {
        expect(res.body.likes).toBe(0)
      })
  })

  test('rejecting a defective post', async () => {
    const withoutUrl = new Blog ({
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      likes: 0
    })
    await api
      .post('/api/blogs')
      .send(withoutUrl)
      .expect(400)
  })

})

afterAll(() => {
  server.close()
})
