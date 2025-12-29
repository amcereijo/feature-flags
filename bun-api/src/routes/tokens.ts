import { getDb } from "../db";
import type { ApiToken } from "../models/types";
import { generateToken } from "../utils/jwt";
import { authMiddleware } from "../middleware/auth";

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
async function createToken(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { name, createdByUid } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: "Missing name" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
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

    return new Response(JSON.stringify(mapApiToken(row)), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Listar tokens API
async function listTokens(_req: Request): Promise<Response> {
  const db = getDb();
  const rows = db.query("SELECT * FROM api_tokens").all();
  const tokens = rows.map(mapApiToken);
  return new Response(JSON.stringify(tokens), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// Eliminar token API
async function deleteToken(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing token ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const db = getDb();
  const row = db.prepare("SELECT * FROM api_tokens WHERE id = ?").get(id);
  if (!row) {
    return new Response(JSON.stringify({ error: "Token not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  db.prepare("DELETE FROM api_tokens WHERE id = ?").run(id);
  return new Response(null, { status: 204 });
}

// Definición de rutas
export const tokenRoutes = [
  {
    path: "/api/tokens",
    method: "POST",
    handler: authMiddleware(createToken),
  },
  {
    path: "/api/tokens",
    method: "GET",
    handler: authMiddleware(listTokens),
  },
  {
    path: "/api/tokens/:id",
    method: "DELETE",
    handler: authMiddleware(deleteToken),
  },
];
