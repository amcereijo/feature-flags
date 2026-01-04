import { getDb } from "../db";
import type { Feature } from "../models/types";
import { clerkMiddleware } from "../middleware/clerk";
import type { Context } from "elysia";
import { Elysia } from "elysia";

// Elysia route registration
export function registerFeatureRoutes() {
  const featureRoutes = new Elysia();

  featureRoutes.post("/api/features", createFeature, {
    beforeHandle: clerkMiddleware,
  });

  featureRoutes.get("/api/features", listFeatures, {
    beforeHandle: clerkMiddleware,
  });

  featureRoutes.get("/api/features/:id", getFeature, {
    beforeHandle: clerkMiddleware,
  });

  featureRoutes.put("/api/features/:id", updateFeature, {
    beforeHandle: clerkMiddleware,
  });

  featureRoutes.delete("/api/features/:id", deleteFeature, {
    beforeHandle: clerkMiddleware,
  });

  return featureRoutes;
}

async function createFeature(ctx: Context) {
  try {
    const body = ctx.body;
    console.log("body", body);

    const { name, value, valueType, resourceId, active } = body as Feature;

    if (!name || typeof value === "undefined") {
      ctx.set.status = 400;
      return { error: "Missing name or value" };
    }

    const db = getDb();
    const { lastInsertRowid } = db.run(
      `INSERT INTO features (name, value, resource_id, value_type, active) VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        value,
        resourceId || null,
        valueType,
        typeof active === "undefined" ? 1 : active ? 1 : 0,
      ],
    );

    // Get the last inserted feature
    const row = db
      .query("SELECT * FROM features WHERE id = ?")
      .get(lastInsertRowid);

    ctx.set.status = 201;
    return mapFeature(row);
  } catch (err) {
    console.error(err);
    ctx.set.status = 400;
    return { error: "Invalid request" };
  }
}

async function listFeatures(ctx: Context) {
  const db = getDb();
  const rows = db.query("SELECT * FROM features").all();
  ctx.set.status = 200;
  return rows.map(mapFeature);
}

async function getFeature(ctx: Context) {
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
async function updateFeature(ctx: Context) {
  const id = ctx.params.id;
  if (!id) {
    ctx.set.status = 400;
    return { error: "Missing feature ID" };
  }
  try {
    const body = ctx.body as Partial<Feature>;
    const { name, value, resourceId, active, valueType } = body;

    const db = getDb();
    const row = db.query("SELECT * FROM features WHERE id = ?").get(id);
    if (!row) {
      ctx.set.status = 404;
      return { error: "Feature not found" };
    }

    db.run(
      `UPDATE features SET name = ?, value = ?, value_type = ?, resource_id = ?, active = ? WHERE id = ?`,
      [
        typeof name === "undefined" ? row.name : name,
        typeof value === "undefined" ? row.value : value,
        typeof valueType === "undefined" ? row.value_type : valueType,
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
async function deleteFeature(ctx: Context) {
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

// Utility to map DB row to Feature type
function mapFeature(row: any): Feature {
  const valueType = row.value_type;

  let value: string | number | boolean;
  if (valueType === "number") {
    value = Number(row.value);
  } else if (valueType === "boolean") {
    value = row.value === "true" || row.value === "1";
  } else {
    value = row.value;
  }

  return {
    id: row.id,
    name: row.name,
    value,
    valueType,
    resourceId: row.resource_id || undefined,
    active: !!row.active,
    createdAt: row.created_at,
  };
}
