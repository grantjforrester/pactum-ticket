const { spec } = require('pactum')
const config = require('./config')
const fs = require('fs')

openapi = fs.readFileSync('openapi.yml')

describe('openapi', () => {
    it('should return expected yaml', async () => {
        await spec()
            .get(`${config.server}/openapi.yml`)
            .expectStatus(200)
            .expectBody(openapi.toString())
    })
})