import { join } from "path";
import { Database } from "bun:sqlite";

const DB_PATH = process.env.DB_PATH || join(process.cwd(), "database.sqlite");

let db: any = null;

export function getDb() {
  if (!db) {
    console.log(`Creating db ${DB_PATH}`);

    db = new Database(DB_PATH);

    // Inicialización de tablas si no existen
    db.run(`
      CREATE TABLE IF NOT EXISTS api_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_used_at DATETIME,
        created_by_uid TEXT
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS features (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        value TEXT NOT NULL,
        value_type TEXT NOT NULL,
        resource_id TEXT,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  return db;
}
