const { spec } = require('pactum')
const { like } = require('pactum-matchers');
const config = require('../config')
const db = require('../db')

describe('read', () => {

    beforeEach(async () => {
        await db.reset()
    });

    it('should read an existing ticket', async () => {
        // Create ticket
        await spec()
            .post(`${config.server}/api/v1/tickets`)
            .withJson({
                summary: "summary",
                description: "description",
                status: "open"
            })
            .expectStatus(201)
            .stores("ticketId", "id")

        // Read ticket
        await spec()
            .get(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "$S{ ticketId }")
            .expectStatus(200)
            .expectJsonMatch({
                id: "$S{ticketId}",
                summary: "summary",
                description: "description",
                status: "open",
                version: "0"
            })
    })

    it('should return error if invalid uuid', async () => {
        await spec()
            .get(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "doesnotexist")
            .expectStatus(400)
            .expectJsonMatch({
                type: "ticket:err:badrequest",
                title: "Bad Request",
                status: 400,
                detail: "invalid ticket id: doesnotexist"
            })
    })

    it('should return error if ticket not found', async () => {
        await spec()
            .inspect()
            .get(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "99999999-9999-9999-9999-999999999999")
            .expectStatus(404)
            .expectJsonMatch({
                type: "ticket:err:notfound",
                title: "Not Found",
                status: 404,
                detail: "no ticket with id 99999999-9999-9999-9999-999999999999 found"
            })
    })
})