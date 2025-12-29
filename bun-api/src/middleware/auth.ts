import { verifyToken } from "../utils/jwt";
import type { JwtPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * Middleware para proteger rutas que requieren autenticación por JWT.
 * Si el token es válido, agrega el payload a req.user y llama al siguiente handler.
 * Si no, responde con 401 Unauthorized.
 */
export function authMiddleware(
  handler: (req: AuthRequest) => Response | Promise<Response>,
) {
  return async (req: Request): Promise<Response> => {
    // BYPASS_AUTH: permite saltar autenticación en entorno de test
    if (process.env.BYPASS_AUTH === "true") {
      // @ts-ignore
      req.user = { uid: "test", name: "bypass" };
      return await handler(req as AuthRequest);
    }

    const authHeader =
      req.headers.get("authorization") || req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const token = authHeader.substring("Bearer ".length).trim();
    try {
      const payload = verifyToken(token);
      // @ts-ignore
      req.user = payload;
      return await handler(req as AuthRequest);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  };
}
