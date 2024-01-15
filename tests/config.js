require('dotenv').config()

module.exports = {
    server: `http://${process.env.API_HOST}:${process.env.API_PORT}`
}