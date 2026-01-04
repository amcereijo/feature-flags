import { getDb } from "../db";
import type { Feature } from "../models/types";
import { clerkMiddleware } from "../middleware/clerk";
import type { Context } from "elysia";
import { Elysia } from "elysia";
import { CreateFeature } from "../usecases/features/create-feature.usecase";
import { ListFeatures } from "../usecases/features/list-features.usecase";
import { GetFeature } from "../usecases/features/get-feature.usecase";
import { UpdateFeature } from "../usecases/features/update-feature.usecase";
import { DeleteFeature } from "../usecases/features/delete-feature.usecase";

const db = getDb();

const createFeatureUseCase = new CreateFeature(db);
const listFeaturesUseCase = new ListFeatures(db);
const getFeatureUseCase = new GetFeature(db);
const updateFeatureUseCase = new UpdateFeature(db);
const deleteFeatureUseCase = new DeleteFeature(db);

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

    // imrpove to add proper validations
    if (!name || typeof value === "undefined") {
      ctx.set.status = 400;
      return { error: "Missing name or value" };
    }

    const feature = await createFeatureUseCase.execute({
      name,
      value,
      valueType,
      resourceId,
      active,
    } as Feature);

    ctx.set.status = 201;
    return feature;
  } catch (err) {
    console.error(err);
    ctx.set.status = 400;
    return { error: "Invalid request" };
  }
}

async function listFeatures(ctx: Context) {
  const features = await listFeaturesUseCase.execute();
  ctx.set.status = 200;
  return features;
}

async function getFeature(ctx: Context) {
  const id = ctx.params.id;
  if (!id) {
    ctx.set.status = 400;
    return { error: "Missing feature ID" };
  }

  const feature = await getFeatureUseCase.execute(Number(id));

  if (!feature) {
    ctx.set.status = 404;
    return { error: "Feature not found" };
  }

  ctx.set.status = 200;
  return feature;
}

async function updateFeature(ctx: Context) {
  const id = ctx.params.id;
  if (!id) {
    ctx.set.status = 400;
    return { error: "Missing feature ID" };
  }
  try {
    const body = ctx.body as Partial<Feature>;

    const updated = await updateFeatureUseCase.execute(Number(id), body);

    if (!updated) {
      ctx.set.status = 404;
      return { error: "Feature not found" };
    }

    ctx.set.status = 200;
    return updated;
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

  const deleted = await deleteFeatureUseCase.execute(Number(id));

  if (!deleted) {
    ctx.set.status = 404;
    return { error: "Feature not found" };
  }

  ctx.set.status = 204;
  return null;
}
