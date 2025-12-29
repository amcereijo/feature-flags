import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // Cambia esto en producción
const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
  uid: string;
  name: string;
  [key: string]: any;
}

/**
 * Genera un JWT para un usuario o token API.
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifica un JWT y retorna el payload si es válido.
 * Lanza un error si el token es inválido o expiró.
 */
export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
