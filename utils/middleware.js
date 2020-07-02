
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
  
const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
    logger,
    error,
    tokenExtractor
}