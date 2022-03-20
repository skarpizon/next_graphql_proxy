const express = require('express')
const next = require('next')
const cors = require('cors')
const apolloServer = require('./src/graphql')

const hostname = 'localhost'
const { PORT = 3000 } = process.env

const nextApp = next({
  dev: process.env.NODE_ENV !== 'production',
  dir: __dirname,
  hostname,
  port: PORT
})

const handler = nextApp.getRequestHandler()

async function main () {
  const app = express()

  await bootstrapApolloServer(app)
  await bootstrapClientApp(app)

  app.listen(PORT, () => {
    console.log(`Server starts on - ${PORT}`)
  })
}

async function bootstrapClientApp(app) {
  await nextApp.prepare()
  app.use(
    cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: ['Accept', 'Access-Control', 'Content-Type', 'pragma'],
      credentials: true
    })
  )
  app.all('*', handler)
}

async function bootstrapApolloServer(app) {
  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
}

main()
