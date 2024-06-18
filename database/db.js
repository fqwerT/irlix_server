const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "1231",
  database: "users",
  host: "localhost",
  port: 5432,
});

module.exports = pool;