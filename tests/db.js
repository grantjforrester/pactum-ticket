const { Pool } = require('pg')



async function reset() {
    const connectionString = 'postgresql://'
        + process.env.PGUSER + ':'
        + process.env.PGPASSWORD + '@'
        + process.env.PGHOST + ':'
        + process.env.PGPORT + '/'
        + process.env.PGDATABASE
    console.log(connectionString)
    const pool = new Pool({ connectionString })
    await pool.query("TRUNCATE tickets")
    await pool.end()
}

module.exports = {
    reset: reset
}