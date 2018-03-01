require('node-env-file')(process.cwd() + '/.env')

const { APP_PORT } = process.env

module.exports = {
  APP_PORT
}
