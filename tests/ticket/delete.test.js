const { spec } = require('pactum')
const { like } = require('pactum-matchers');
const config = require('../config')
const db = require('../db')

describe('delete', () => {

    beforeEach(async () => {
        await db.reset()
    });

    it('should create and delete a ticket', async () => {
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

        // Delete ticket
        await spec()
            .delete(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "$S{ ticketId }")
            .expectStatus(204)

        // Confirm not found
        await spec()
            .get(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "$S{ ticketId }")
            .expectStatus(404)
    })

    it('should allow delete if ticket not found', async () => {
        await spec()
            .delete(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "99999999-9999-9999-9999-999999999999")
            .expectStatus(204)

        // Confirm not found
        await spec()
            .get(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "99999999-9999-9999-9999-999999999999")
            .expectStatus(404)
    })

    it('should return error if invalid uuid', async () => {
        await spec()
            .delete(`${config.server}/api/v1/tickets/{id}`)
            .withPathParams("id", "doesnotexist")
            .expectStatus(400)
            .expectJsonMatch({
                type: "induction:go:err:badrequest",
                title: "Bad Request",
                status: 400,
                detail: "invalid ticket id: doesnotexist"
            })
    })

})