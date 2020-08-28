const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.status(200).json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if(body.password === undefined || body.password.length < 3) {
    return response.status(400).json({error: 'password length must be 3 characters'})
  }
  if(body.username === undefined || body.username.length < 3) {
    return response.status(400).json({error: 'username length must be 3 characters'})
  }

  const existingUser = await User.find({ username: body.username })
  if (existingUser.length > 0) {
    return response.status(422).json({ error: 'username must be unique' })
  }

  if(body.adult === undefined) body.adult = true
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    name: body.name,
    username: body.username,
    passwordHash: passwordHash
  })

  const savedUser = await user.save()
  response.status(200).json(savedUser)
  })

module.exports = usersRouter