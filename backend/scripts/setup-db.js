const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const database = process.env.DB_NAME;
  if (!database || !/^[A-Za-z0-9_]+$/.test(database)) {
    throw new Error('DB_NAME must contain only letters, numbers, and underscores');
  }
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await connection.query(`USE \`${database}\``);
    for (const file of ['schema.sql', 'demo.sql']) {
      const sql = fs.readFileSync(path.join(__dirname, '..', 'db', file), 'utf8');
      await connection.query(sql);
    }
    console.log(`Initialized ${database} with illustrative demo data`);
  } finally {
    await connection.end();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
