/**
 * Created by vivalaakam on 24.01.2019.
 *
 * @flow
 */

module.exports = {
  redis_url: process.env.REDIS_URL || 'redis://localhost:6379',
  pusher_server: process.env.PUSHER_SEREVR || 'http://localhost:5000',
  auth_server: process.env.AUTH_SEREVR || 'http://localhost:4000',
  secret_jwt: process.env.SECRET_JWT || 'SECRET_KEY',
  secret_hmac: process.env.SECRET_HMAC || 'SECRET_KEY',
  port: parseInt(process.env.PORT, 10) || 5000
}
