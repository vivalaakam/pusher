/**
 * Created by vivalaakam on 24.01.2019.
 *
 * @flow
 */

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const config = require('../config')
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret_jwt
}

module.exports = new JwtStrategy(opts, (jwt_payload, done) => {
  if (jwt_payload.sid) {
    return done(null, jwt_payload)
  }
  return done(null, false)
})
