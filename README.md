# pactum-ticket

Api testing exercise written with PactumJS.

## Running Tests

1. Start application and any dependencies.

2. Ensure test values are correct in [`.env`](/.env)

3. Install test dependecies:

```
npm install
```

4. Run tests:

```
export $(grep -v '^#' .env | xargs)
npm run test
```
