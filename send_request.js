/**
 * Created by vivalaakam on 30.01.2019.
 *
 * @flow
 */
const fetch = require('node-fetch')
const crypto = require('crypto')
const queryString = require('query-string')

const config = require('./config')

function send_push(users, room, data) {
  const query = queryString.stringify({
    users,
    room,
    stamp: Math.floor(+new Date() / 1000)
  })

  const signature = crypto.createHmac('sha256', config.secret_hmac).update(query).digest('hex')

  return fetch(config.pusher_server + '/push?' + query, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Signature': signature
    },
    body: JSON.stringify(data)
  })
}

send_push(['123', '456'], 'room', {
  aaaa: 'bbbb',
  cccc: 'cccc'
})
