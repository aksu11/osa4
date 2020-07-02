const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "Testi1",
    author: "Testaaja",
    url: "http://google.fi",
    likes: 1
  },
  {
    title: "Testi12",
    author: "Testaaja",
    url: "http://google.fi",
    likes: 2
  },
  {
    title: "Testi123",
    author: "Testaaja",
    url: "http://google.fi",
    likes: 3
  }
] 

describe('API-tests', () => {

  beforeAll( async () => {
    await Blog.deleteMany({})
    const blogObjects = initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(blogs.body.length).toBe(3)
  })

  test('blogs have key "id"', async () => {
    const blogs = await api.get('/api/blogs')
    blogs.body.map(blog => {
      expect(blog.id).toBeDefined()
    })
  })

  test('blogs are added to database', async () => {
    const newBlog = {
      title: "Testiblogi",
      author: "Hessu Hopo",
      url: "http://google.fi",
      likes: 4
    }
    const blogsBefore = await api.get('/api/blogs')
    const addedBlog = await api.post('/api/blogs').send(newBlog)
    const blogsAfter = await api.get('/api/blogs')
    expect(blogsAfter.body.length).toBe(blogsBefore.body.length+1)
    expect(blogsAfter.body).toContainEqual(addedBlog.body)
  })

  test('if field "likes" do not have value, it will be set as 0', async () => {
    const newBlog = {
      title: "Testiblogi2",
      author: "Hessu Hopo",
      url: "http://google.fi"
    }
    const addedBlog = await api.post('/api/blogs').send(newBlog)
    expect(addedBlog.body.likes).toBe(0)
  })

  test('fields "title" and "url" have values', async () => {
    const noUrl = {
      title: "Testiblogi3",
      author: "Hessu Hopo",
      likes: 3
    }
    const noTitle = {
      author: "Hessu Hopo",
      url: "http://google.fi",
      likes: 4
    }
    await api.post('/api/blogs').send(noUrl)
      .expect(400)
    await api.post('/api/blogs').send(noTitle)
      .expect(400)
  })

  test('blog are deleted from database', async () => {
    const blogsBefore = await api.get('/api/blogs').expect(200)
    const blogToDelete = blogsBefore.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAfter = await api.get('/api/blogs')
    expect(blogsAfter.body).toHaveLength(blogsBefore.body.length - 1)
    const titles = blogsAfter.body.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('the number of likes increases by one', async () => {
    const blogsBefore = await api.get('/api/blogs')
    const blogToLike = blogsBefore.body[0]
    const likedBlog = await api.put(`/api/blogs/${blogToLike.id}`)
      .expect(200)

    expect(blogToLike.likes).toBe(likedBlog.body.likes - 1)
  })

  afterAll( () => {
    mongoose.connection.close()
  })

})
