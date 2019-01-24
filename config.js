/**
 * Created by vivalaakam on 24.01.2019.
 *
 * @flow
 */

module.exports = {
  auth_server: process.env.AUTH_SEREVR || 'http://localhost:4000',
  secret_jwt: process.env.SECRET_JSW || 'SECRET_KEY',
  port: parseInt(process.env.PORT, 10) || 5000
}
