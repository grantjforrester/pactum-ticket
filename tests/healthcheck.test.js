const { spec } = require('pactum')
const config = require('./config')

describe('healthcheck', () => {
    it('should return OK', async () => {
        await spec()
            .get(`${config.server}/health`)
            .expectStatus(200)
    })
})