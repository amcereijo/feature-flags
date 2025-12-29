import { getDb } from "../db";
import type { Feature } from "../models/types";
import { authMiddleware } from "../middleware/auth";
import type { Elysia } from "elysia";

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
async function createFeature(ctx: any) {
  try {
    const body = ctx.body;
    const { name, value, resourceId, active } = body;

    if (!name || typeof value === "undefined") {
      ctx.set.status = 400;
      return { error: "Missing name or value" };
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

    ctx.set.status = 201;
    return mapFeature(row);
  } catch (err) {
    ctx.set.status = 400;
    return { error: "Invalid request" };
  }
}

// Listar features
async function listFeatures(ctx: any) {
  const db = getDb();
  const rows = db.query("SELECT * FROM features").all();
  ctx.set.status = 200;
  return rows.map(mapFeature);
}

// Obtener feature por ID
async function getFeature(ctx: any) {
  const id = ctx.params.id;
  if (!id) {
    ctx.set.status = 400;
    return { error: "Missing feature ID" };
  }
  const db = getDb();
  const row = db.query("SELECT * FROM features WHERE id = ?").get(id);
  if (!row) {
    ctx.set.status = 404;
    return { error: "Feature not found" };
  }
  ctx.set.status = 200;
  return mapFeature(row);
}

// Actualizar feature
async function updateFeature(ctx: any) {
  const id = ctx.params.id;
  if (!id) {
    ctx.set.status = 400;
    return { error: "Missing feature ID" };
  }
  try {
    const body = ctx.body;
    const { name, value, resourceId, active } = body;

    const db = getDb();
    const row = db.query("SELECT * FROM features WHERE id = ?").get(id);
    if (!row) {
      ctx.set.status = 404;
      return { error: "Feature not found" };
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
    ctx.set.status = 200;
    return mapFeature(updated);
  } catch (err) {
    ctx.set.status = 400;
    return { error: "Invalid request" };
  }
}

// Eliminar feature
async function deleteFeature(ctx: any) {
  const id = ctx.params.id;
  if (!id) {
    ctx.set.status = 400;
    return { error: "Missing feature ID" };
  }
  const db = getDb();
  const row = db.query("SELECT * FROM features WHERE id = ?").get(id);
  if (!row) {
    ctx.set.status = 404;
    return { error: "Feature not found" };
  }
  db.run("DELETE FROM features WHERE id = ?", [id]);
  ctx.set.status = 204;
  return null;
}

// Elysia route registration
export function registerFeatureRoutes(app: Elysia) {
  app.post(
    "/api/features",
    async (ctx) => authMiddleware(() => createFeature(ctx))(ctx.request),
    {
      detail: { summary: "Create feature" },
      body: "json",
      response: "json",
    },
  );
  app.get(
    "/api/features",
    async (ctx) => authMiddleware(() => listFeatures(ctx))(ctx.request),
    {
      detail: { summary: "List features" },
      response: "json",
    },
  );
  app.get(
    "/api/features/:id",
    async (ctx) => authMiddleware(() => getFeature(ctx))(ctx.request),
    {
      detail: { summary: "Get feature by ID" },
      response: "json",
    },
  );
  app.put(
    "/api/features/:id",
    async (ctx) => authMiddleware(() => updateFeature(ctx))(ctx.request),
    {
      detail: { summary: "Update feature" },
      body: "json",
      response: "json",
    },
  );
  app.delete(
    "/api/features/:id",
    async (ctx) => authMiddleware(() => deleteFeature(ctx))(ctx.request),
    {
      detail: { summary: "Delete feature" },
      response: "json",
    },
  );
}
