import { healthRoute } from "./health";
import { featureRoutes } from "./features";
import { tokenRoutes } from "./tokens";

type Route = {
  path: string;
  method: string;
  handler: (req: Request) => Promise<Response> | Response;
};

/**
 * Lista de todas las rutas principales de la API.
 * Agrega aquí las rutas importadas.
 */
export const routes: Route[] = [healthRoute, ...featureRoutes, ...tokenRoutes];

/**
 * Busca y ejecuta el handler correspondiente para una request.
 * Si no hay coincidencia, retorna 404.
 */
export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const method = req.method.toUpperCase();

  // Soporte para rutas con parámetros tipo /api/features/:id
  for (const route of routes) {
    // Convertir path tipo /api/features/:id a regex
    const paramRegex = /^:([a-zA-Z0-9_]+)$/;
    const routeParts = route.path.split("/");
    const urlParts = url.pathname.split("/");

    if (
      routeParts.length === urlParts.length &&
      routeParts.every(
        (part, i) => part === urlParts[i] || paramRegex.test(part),
      ) &&
      route.method === method
    ) {
      // Si hay parámetros, podrías extraerlos aquí si lo necesitas
      return await route.handler(req);
    }
  }

  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
