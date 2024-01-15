const { spec } = require('pactum')
const { like } = require('pactum-matchers');
const config = require('../config')
const db = require('../db')

describe('create', () => {

    beforeEach(async () => {
        await db.reset()
    });

    it('should create a ticket', async () => {
        // Create ticket
        await spec()
            .post(`${config.server}/api/v1/tickets`)
            .withJson({
                summary: "summary",
                description: "description",
                status: "open"
            })
            .expectStatus(201)
            .expectJsonMatch({
                id: like("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"),
                summary: "summary",
                description: "description",
                status: "open",
                version: "0"
            })
    })
})