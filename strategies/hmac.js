/**
 * Created by vivalaakam on 30.01.2019.
 *
 * @flow
 */
const passport = require('passport-strategy')
const url = require('url')
const crypto = require('crypto')
const util = require('util')
const config = require('../config')

function HMACStrategy(opts, verify) {
  passport.Strategy.call(this)

  this.name = 'hmac'

  this._secretOrKey = opts.secretOrKey
  this._verify = verify

  this._passReqToCallback = opts.passReqToCallback
}

util.inherits(HMACStrategy, passport.Strategy)

HMACStrategy.prototype.authenticate = function (req, options) {
  const given = req.header('Signature')

  if (!given) {
    return this.fail(new Error('No auth token'))
  }

  const computed = crypto.createHmac('sha256', this._secretOrKey).update(url.parse(req.url).query).digest('hex')

  const computedSignatureBuffer = Buffer.from(computed, 'hex')
  const retrievedSignatureBuffer = Buffer.from(given, 'hex')
  const valid = crypto.timingSafeEqual(computedSignatureBuffer, retrievedSignatureBuffer)

  if (!valid) {
    return this.fail(new Error('Invalid token'))
  }

  const self = this

  const verified = function (err, user, info) {
    if (err) {
      return self.error(err)
    } else if (!user) {
      return self.fail(info)
    } else {
      return self.success(user, info)
    }
  }

  try {
    if (this._passReqToCallback) {
      this._verify(req, {
        ...req.query,
        stamp: Number(req.query.stamp)
      }, verified)
    } else {
      this._verify({
        ...req.query,
        stamp: Number(req.query.stamp)
      }, verified)
    }
  } catch (ex) {
    this.error(ex)
  }
}


const opts = {
  secretOrKey: config.secret_hmac
}

module.exports = new HMACStrategy(opts, (payload, done) => {
  const stamp = new Date(payload.stamp * 1000)
  stamp.setMinutes(stamp.getMinutes() - 5)

  if (Math.floor((stamp.getTime()) / 1000) < payload.stamp) {
    return done(null, payload)
  }
  return done(null, false)
})
