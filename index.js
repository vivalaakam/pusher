/**
 * Created by vivalaakam on 24.01.2019.
 *
 * @flow
 */
const http = require('http')
const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const redis = require('redis')
const bluebird = require('bluebird')
const crypto = require('crypto')
const WebSocketServer = require('websocket').server

const asyncMiddleware = require('./utils/asyncMiddleware')
const config = require('./config.js')
const wsHost = config.pusher_server.replace(/^http/, 'ws')



bluebird.promisifyAll(redis)

const client = redis.createClient(config.redis_url)

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('./passport')(passport)


app.get('/', (req, res) => {
  res.send({})
})

app.post('/register', passport.authenticate('jwt', { session: false }), asyncMiddleware(async (req, res) => {
  const hash = crypto.createHash('sha256')
  hash.update(req.user.sid)
  const hex = hash.digest('hex')

  await client.saddAsync(req.user.uid, hex)


  return res.send({
    hex,
    connect: wsHost + '/' + hex
  })
}))

app.post('/push', (req, res) => {
  let { user, room, message } = req.body

  if (!Array.isArray(user)) {
    user = [user]
  }

  user.forEach((u) => {
    client.smembersAsync(u)
      .then((subs) => {
        subs.forEach((sub) => {
          client.sismemberAsync(sub, room).then((rep) => {
            if (rep) {
              connections[sub].sendUTF(JSON.stringify({
                room,
                message
              }))
            }
          })
        })
      })
  })

  res.send(true)
})
const server = http.createServer(app)


const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
})

const connections = {}

wsServer.on('request', function (request) {
  const id = request.resourceURL.pathname.substr(1)
  const connection = request.accept(null, request.origin)
  console.log(id + ' Connection accepted.')
  connections[id] = connection

  connection.on('message', function (message) {
    const data = JSON.parse(message.utf8Data)

    switch (data.action) {
      case 'join':
        client.sadd(id, data.room)
        break
      case 'leave':
        client.srem(id, data.room)
        break
    }
  })
  connection.on('close', function (reasonCode, description) {
    delete connections[id]
    client.del(id)
  })
})


server.listen(config.port)
