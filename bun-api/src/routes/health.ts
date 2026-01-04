import { Elysia } from "elysia";

/**
 * Registers the health check route on the provided Elysia app.
 */
export function registerHealthRoute() {
  const healthRoute = new Elysia();

  healthRoute.get("/health", () => ({ status: "ok" }));

  return healthRoute;
}
