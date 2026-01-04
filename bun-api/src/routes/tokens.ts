import { getDb } from "../db";
import { clerkMiddleware } from "../middleware/clerk";
import type { Context } from "elysia";
import { Elysia } from "elysia";
import { CreateTokenUseCase } from "../usecases/tokens/create-token.usecase";
import { ListTokensUseCase } from "../usecases/tokens/list-tokens.usecase";
import { DeleteTokenUseCase } from "../usecases/tokens/delete-token.usecase";

const db = getDb();

const createTokenUseCase = new CreateTokenUseCase(db);
const listTokensUseCase = new ListTokensUseCase(db);
const deleteTokenUseCase = new DeleteTokenUseCase(db);

// Elysia route registration
export function registerTokenRoutes() {
  const tokenRoutes = new Elysia().group(
    "/api/tokens",
    {
      beforeHandle: clerkMiddleware,
    },
    (tokenRoutes) =>
      tokenRoutes
        .post("/", createToken)
        .get("/", listTokens)
        .delete("/:id", deleteToken),
  );

  return tokenRoutes;
}

async function createToken(ctx: Context) {
  try {
    const body = ctx.body as { name: string; createdByUid?: string };
    const { name, createdByUid } = body;

    if (!name) {
      ctx.set.status = 400;
      return { error: "Missing name" };
    }

    const token = await createTokenUseCase.execute({ name, createdByUid });

    ctx.set.status = 201;
    return token;
  } catch (err) {
    ctx.set.status = 400;
    return { error: "Invalid request" };
  }
}

async function listTokens(ctx: Context) {
  const tokens = await listTokensUseCase.execute();
  ctx.set.status = 200;
  return tokens;
}

async function deleteToken(ctx: Context) {
  const id = ctx.params.id;
  if (!id) {
    ctx.set.status = 400;
    return { error: "Missing token ID" };
  }

  const deleted = await deleteTokenUseCase.execute(Number(id));

  if (!deleted) {
    ctx.set.status = 404;
    return { error: "Token not found" };
  }

  ctx.set.status = 204;
  return null;
}
