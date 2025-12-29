import { getDb } from "../db";
import type { Feature } from "../models/types";
import { authMiddleware } from "../middleware/auth";

// Utilidad para mapear filas de la base de datos al modelo Feature
function mapFeature(row: any): Feature {
  return {
    id: row.id,
    name: row.name,
    value: row.value,
    resourceId: row.resource_id || undefined,
    active: !!row.active,
    createdAt: row.created_at,
  };
}

// Crear feature
async function createFeature(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { name, value, resourceId, active } = body;

    if (!name || typeof value === "undefined") {
      return new Response(JSON.stringify({ error: "Missing name or value" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const db = getDb();
    db.run(
      `INSERT INTO features (name, value, resource_id, active) VALUES (?, ?, ?, ?)`,
      [
        name,
        value,
        resourceId || null,
        typeof active === "undefined" ? 1 : active ? 1 : 0,
      ],
    );
    // Recuperar el último feature insertado
    const row = db
      .query("SELECT * FROM features ORDER BY id DESC LIMIT 1")
      .get();

    return new Response(JSON.stringify(mapFeature(row)), {
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

// Listar features
async function listFeatures(_req: Request): Promise<Response> {
  const db = getDb();
  const rows = db.query("SELECT * FROM features").all();
  const features = rows.map(mapFeature);
  return new Response(JSON.stringify(features), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// Obtener feature por ID
async function getFeature(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing feature ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const db = getDb();
  const row = db.query("SELECT * FROM features WHERE id = ?").get(id);
  if (!row) {
    return new Response(JSON.stringify({ error: "Feature not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify(mapFeature(row)), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// Actualizar feature
async function updateFeature(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing feature ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const body = await req.json();
    const { name, value, resourceId, active } = body;

    const db = getDb();
    const row = db.query("SELECT * FROM features WHERE id = ?").get(id);
    if (!row) {
      return new Response(JSON.stringify({ error: "Feature not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    db.run(
      `UPDATE features SET name = ?, value = ?, resource_id = ?, active = ? WHERE id = ?`,
      [
        typeof name === "undefined" ? row.name : name,
        typeof value === "undefined" ? row.value : value,
        typeof resourceId === "undefined" ? row.resource_id : resourceId,
        typeof active === "undefined" ? row.active : active ? 1 : 0,
        id,
      ],
    );

    const updated = db.query("SELECT * FROM features WHERE id = ?").get(id);
    return new Response(JSON.stringify(mapFeature(updated)), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Eliminar feature
async function deleteFeature(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing feature ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const db = getDb();
  const row = db.query("SELECT * FROM features WHERE id = ?").get(id);
  if (!row) {
    return new Response(JSON.stringify({ error: "Feature not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  db.run("DELETE FROM features WHERE id = ?", [id]);
  return new Response(null, { status: 204 });
}

// Definición de rutas
export const featureRoutes = [
  {
    path: "/api/features",
    method: "POST",
    handler: authMiddleware(createFeature),
  },
  {
    path: "/api/features",
    method: "GET",
    handler: authMiddleware(listFeatures),
  },
  {
    path: "/api/features/:id",
    method: "GET",
    handler: authMiddleware(getFeature),
  },
  {
    path: "/api/features/:id",
    method: "PUT",
    handler: authMiddleware(updateFeature),
  },
  {
    path: "/api/features/:id",
    method: "DELETE",
    handler: authMiddleware(deleteFeature),
  },
];
