const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)
  if(blog.url === undefined || blog.title === undefined) {
    return response.status(400).json('information is missing').end()
  }
  if(blog.likes === undefined) blog.likes = 0
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

blogsRouter.delete('/:id', (request, response) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error.name)
      response.status(400).json('something went wrong').end()
    })
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  blog.likes++
  Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true } )
    .then(updatedBlog => {
      response.status(200).json(updatedBlog)
    })
    .catch(error => {
      console.log(error.name)
      response.status(400).send({ error: 'malformatted id' })
    })
})

module.exports = blogsRouter