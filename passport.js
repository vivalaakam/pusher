/**
 * Created by vivalaakam on 24.01.2019.
 *
 * @flow
 */

const jwt_strategy = require('./strategies/jwt')
const hmac_strategy = require('./strategies/hmac')

module.exports = function (passport) {
  passport.use(jwt_strategy)
  passport.use(hmac_strategy)

  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    done(null, user)
  })
}
