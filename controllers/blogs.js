const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', 'username')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  try {
    const decodedToken = jwt.verify(body.token, process.env.SECRET)
    if (!body.token || !decodedToken.id) return response.status(401).json({ error: 'token missing or invalid' })
    if (body.title === undefined || body.author === undefined || body.url === undefined ||
      body.title.length <3 || body.author.length < 3 || body.url.length < 10) {
      return response.status(400).json({ error: 'bad request' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ? body.likes : 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog)

  } catch (exception) {
    next(exception)
  }

})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.body.token, process.env.SECRET)
    if (!request.body.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if(!blog) {
      return response.status(400).send({ error: 'malformatted id' })
    }

    if(blog.user.toString() !== decodedToken.id) {
      return response.status(401).json({ error: 'Unauthorized' })
    }
    await Blog.findByIdAndRemove(blog.id)
    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {

  try {
    const blog = await Blog.findById(request.params.id)
    if(!blog) {
      return response.status(400).send({ error: 'malformatted id' })
    }
    blog.likes++
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true } )
    response.status(200).json(updatedBlog).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter