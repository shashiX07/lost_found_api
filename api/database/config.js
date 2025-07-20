const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

sql`SELECT NOW()`.then(res => {
    console.log("Connected to the database successfully:", res[0]);
}).catch(err => {
    console.error("Error connecting to the database:", err);
});

module.exports = {sql};