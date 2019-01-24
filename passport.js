/**
 * Created by vivalaakam on 24.01.2019.
 *
 * @flow
 */

const jwt_strategy = require('./strategies/jwt')

module.exports = function (passport) {
  passport.use(jwt_strategy)

  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    done(null, user)
  })
}
