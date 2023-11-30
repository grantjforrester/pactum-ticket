const { spec } = require('pactum')

describe('Todo API', () => {
    it('should return the correct headers', async () => {
        await spec()
            .get('http://jsonplaceholder.typicode.com/todos')
            .expectHeader('content-type', 'application/json; charset=utf-8')
    })
})