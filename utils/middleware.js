
const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
const tokenExtractor = (request, response, next) => {
  const token = request.get('authorization')
  if (token && token.toLowerCase().startsWith('bearer ')) {
    request.body.token = token.substring(7)
  }
  next()
}
  
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') return response.status(400).send( {error: 'malformatted id'} )
  else if (error.name === 'ValidationError') return response.status(400).json( { error: error.message } )
  else if (error.name === 'JsonWebTokenError') return response.status(401).json( { error: 'invalid token'} )
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  logger,
  errorHandler,
  tokenExtractor,
  unknownEndpoint
}