import type { Elysia } from "elysia";

/**
 * Registers the health check route on the provided Elysia app.
 */
export function registerHealthRoute(app: Elysia) {
  app.get("/health", () => ({ status: "ok" }));
}
