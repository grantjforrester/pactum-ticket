const { spec } = require('pactum')
const { like } = require('pactum-matchers');
const config = require('../config')
const db = require('../db')

const tickets = []
for (i = 1; i < 4; i++) {
    tickets.push({
        summary: `summary${i}`,
        description: `description${i}`,
        status: i % 2 == 1 ? "open" : "closed"
    })
}

function asMatch(resource) {
    return {
        id: like("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"),
        ...resource,
        version: "0"
    }
}

describe('query', () => {

    beforeEach(async () => {
        await db.reset()

        // Create test tickets
        await Promise.all(tickets.map(async (ticket) => {
            await spec()
                .post(`${config.server}/api/v1/tickets`)
                .withJson(ticket)
                .expectStatus(201)
        }))
    })

    it('should return a page of tickets - no order', async () => {
        await spec()
            .get(`${config.server}/api/v1/tickets`)
            .expectStatus(200)
            .expectJsonMatch({
                results: like([{}, {}, {}]),
                page: 1,
                size: 3
            })
    })

    describe('paging', () => {

        it('should return a page of at most (size) tickets - no order', async () => {
            await spec()
                .get(`${config.server}/api/v1/tickets?size=2`)
                .expectStatus(200)
                .expectJsonMatch({
                    results: like([{}, {}]),
                    page: 1,
                    size: 2
                })
        })

        it('should return a given page of at most (size) tickets - no order', async () => {
            await spec()
                .get(`${config.server}/api/v1/tickets?page=2&size=2`)
                .expectStatus(200)
                .expectJsonMatch({
                    results: like([{}]),
                    page: 2,
                    size: 1
                })
        })
    })

    describe('sorting', () => {
        it('should return tickets sorted by summary ascending', async () => {
            await spec()
                .get(`${config.server}/api/v1/tickets?sort=summary+asc`)
                .expectStatus(200)
                .expectJsonMatch({
                    results: [
                        asMatch(tickets[0]),
                        asMatch(tickets[1]),
                        asMatch(tickets[2])
                    ],
                    page: 1,
                    size: 3
                })
        })

        it('should return tickets sorted by summary descending', async () => {
            await spec()
                .get(`${config.server}/api/v1/tickets?sort=summary+desc`)
                .expectStatus(200)
                .expectJsonMatch({
                    results: [
                        asMatch(tickets[2]),
                        asMatch(tickets[1]),
                        asMatch(tickets[0])
                    ],
                    page: 1,
                    size: 3
                })
        })
    })

    describe("filtering", () => {
        it('should return tickets matching summary field', async () => {
            await spec()
                .get(`${config.server}/api/v1/tickets?filter=summary%3D%3Dsummary1`)
                .expectStatus(200)
                .expectJsonMatch({
                    results: [
                        asMatch(tickets[0])
                    ],
                    page: 1,
                    size: 1
                })
        })

        it('should return tickets not matching summary field', async () => {
            await spec()
                .get(`${config.server}/api/v1/tickets?filter=summary%21%3Dsummary1`)
                .expectStatus(200)
                .expectJsonMatch({
                    results: [
                        asMatch(tickets[1]),
                        asMatch(tickets[2])
                    ],
                    page: 1,
                    size: 2
                })
        })
    })
})