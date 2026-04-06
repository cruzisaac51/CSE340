const { Pool, types } = require("pg")
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool
if (process.env.MOCK_DB === "true" || process.env.MOCK_DB === "true\r" || process.env.MOCK_DB === "true\n") {
  console.log("⚠️ EJECUTANDO EN MODO MOCK DB TEMPORAL ⚠️");
  module.exports = require("./mock-db.js");
} else {
  if (process.env.NODE_ENV == "development") {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })

  // Added for troubleshooting queries
  // during development
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params)
          console.log("executed query", { text })
          return res
          
      } catch (error) {
        console.error("error in query", { text })
        throw error
      }
    }, 
  }
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  module.exports = pool
}
}
//console.log("whtsiside pool", pool)