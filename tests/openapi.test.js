const { spec } = require('pactum')
const config = require('./config')

describe('openapi', () => {
    it('should return expected yaml', async () => {
        await spec()
            .get(`${config.server}/openapi.yml`)
            .expectStatus(200)
    })
})