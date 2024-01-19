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

    it('should return error if ticket field missing', async () => {
        // Create ticket
        await spec()
            .post(`${config.server}/api/v1/tickets`)
            .withJson({
                summary: "summary1"
            })
            .expectStatus(400)
            .expectJsonMatch({
                type: "ticket:err:badrequest",
                title: "Bad Request",
                status: 400,
                detail: "missing field: status"
            })
    })

    it('should return error if ticket field wrong type', async () => {
        // Create ticket
        await spec()
            .post(`${config.server}/api/v1/tickets`)
            .withJson({
                summary: "summary1",
                status: true,
            })
            .expectStatus(400)
            .expectJsonMatch({
                type: "ticket:err:badrequest",
                title: "Bad Request",
                status: 400,
                detail: "invalid type for field: status"
            })
    })
})