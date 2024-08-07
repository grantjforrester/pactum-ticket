const { spec } = require('pactum')
const config = require('../config')
const db = require('../db')

describe('update', () => {

    beforeEach(async () => {
        await db.reset()
    });

    it('should update an existing ticket', async () => {
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

        // Update ticket
        await spec()
            .put(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "$S{ ticketId }")
            .withJson({
                summary: "updated summary",
                description: "updated description",
                status: "closed",
                version: "0"
            })
            .expectStatus(200)
            .expectJsonMatch({
                id: "$S{ticketId}",
                summary: "updated summary",
                description: "updated description",
                status: "closed",
                version: "1"
            })
    })

    it('should return error if ticket not found', async () => {
        await spec()
            .put(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "99999999-9999-9999-9999-999999999999")
            .withJson({
                summary: "updated summary",
                description: "updated description",
                status: "closed",
                version: "0"
            })
            .expectStatus(404)
            .expectJsonMatch({
                type: "ticket:err:notfound",
                title: "Not Found",
                status: 404,
                detail: "no ticket with id 99999999-9999-9999-9999-999999999999 found"
            })
    })

    it('should return error if ticket field missing', async () => {
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

        // Update ticket
        await spec()
            .put(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "$S{ ticketId }")
            .withJson({
                summary: "updated summary",
                version: "0"
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
                summary: "summary",
                description: "description",
                status: "open"
            })
            .expectStatus(201)
            .stores("ticketId", "id")

        // Update ticket
        await spec()
            .put(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "$S{ ticketId }")
            .withJson({
                summary: "updated summary",
                status: true,
                version: "0"
            })
            .expectStatus(400)
            .expectJsonMatch({
                type: "ticket:err:badrequest",
                title: "Bad Request",
                status: 400,
                detail: "invalid type for field: status"
            })
    })

    it('should return error if version field missing', async () => {
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

        // Update ticket
        await spec()
            .inspect()
            .put(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "$S{ ticketId }")
            .withJson({
                summary: "updated summary",
                description: "updated description",
                status: "closed"
            })
            .expectStatus(400)
            .expectJsonMatch({
                type: "ticket:err:badrequest",
                title: "Bad Request",
                status: 400,
                detail: "missing field: version"
            })
    })

    it('should return error if version field wrong type', async () => {
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

        // Update ticket
        await spec()
            .inspect()
            .put(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "$S{ ticketId }")
            .withJson({
                summary: "updated summary",
                description: "updated description",
                status: "closed",
                version: true
            })
            .expectStatus(400)
            .expectJsonMatch({
                type: "ticket:err:badrequest",
                title: "Bad Request",
                status: 400,
                detail: "invalid type for field: version"
            })
    })


    it('should return error if wrong version', async () => {
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

        // Update ticket
        await spec()
            .inspect()
            .put(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "$S{ ticketId }")
            .withJson({
                summary: "updated summary",
                description: "updated description",
                status: "closed",
                version: "1"
            })
            .expectStatus(409)
            .expectJsonMatch({
                type: "ticket:err:conflict",
                title: "Conflict",
                status: 409,
                detail: "version conflict"
            })
    })

})