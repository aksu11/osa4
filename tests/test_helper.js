const Blog= require('../models/blog')

const nonExistingId = async () => {
  const note = new Blog()
  await note.save()
  await note.remove()
  return note._id.toString()
}

const blogsInDb = async () => {
  const response = await Blog.find({})
  console.log(response)
  const blogs = response.body.map(blog => {
    delete blog.id
  })
  console.log(blogs)
  return blogs
}

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

module.exports = {
  nonExistingId, blogsInDb, usersInDb
}