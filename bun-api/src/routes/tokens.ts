import { getDb } from "../db";
import type { ApiToken } from "../models/types";
import { generateToken } from "../utils/jwt";
import { clerkMiddleware } from "../middleware/clerk";
import type { Elysia } from "elysia";

// Utilidad para mapear filas de la base de datos al modelo ApiToken
function mapApiToken(row: any): ApiToken {
  return {
    id: row.id,
    name: row.name,
    token: row.token,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at || undefined,
    createdByUid: row.created_by_uid || undefined,
  };
}

// Crear token API
async function createToken(ctx: any) {
  try {
    const body = ctx.body;
    const { name, createdByUid } = body;

    if (!name) {
      ctx.set.status = 400;
      return { error: "Missing name" };
    }

    // Generar JWT como token API
    const token = generateToken({ name, uid: createdByUid || "" });

    const db = getDb();
    db.run(
      `INSERT INTO api_tokens (name, token, created_by_uid) VALUES (?, ?, ?)`,
      [name, token, createdByUid || null],
    );

    // Recuperar el último token insertado
    const row = db
      .query("SELECT * FROM api_tokens ORDER BY id DESC LIMIT 1")
      .get();

    ctx.set.status = 201;
    return mapApiToken(row);
  } catch (err) {
    ctx.set.status = 400;
    return { error: "Invalid request" };
  }
}

// Listar tokens API
async function listTokens(ctx: any) {
  const db = getDb();
  const rows = db.query("SELECT * FROM api_tokens").all();
  ctx.set.status = 200;
  return rows.map(mapApiToken);
}

// Eliminar token API
async function deleteToken(ctx: any) {
  const id = ctx.params.id;
  if (!id) {
    ctx.set.status = 400;
    return { error: "Missing token ID" };
  }
  const db = getDb();
  const row = db.prepare("SELECT * FROM api_tokens WHERE id = ?").get(id);
  if (!row) {
    ctx.set.status = 404;
    return { error: "Token not found" };
  }
  db.prepare("DELETE FROM api_tokens WHERE id = ?").run(id);
  ctx.set.status = 204;
  return null;
}

// Elysia route registration
export function registerTokenRoutes(app: Elysia) {
  app.post("/api/tokens", async (ctx) => {
    await clerkMiddleware(ctx);
    return createToken(ctx);
  });

  app.get("/api/tokens", async (ctx) => {
    await clerkMiddleware(ctx);
    return listTokens(ctx);
  });

  app.delete("/api/tokens/:id", async (ctx) => {
    await clerkMiddleware(ctx);
    return deleteToken(ctx);
  });
}
