import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { spawn } from "bun";
import path from "path";

const BASE_PORT = 3457;
const BASE_URL = `http://localhost:${BASE_PORT}`;
let adminToken: string;
let createdTokenId: number;
let createdToken: string;
let serverProcess: any;

// Cambia esto por un token válido de admin o crea uno manualmente antes de correr los tests
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "<admin-token>";

beforeAll(async () => {
  // Inicia el servidor de Bun como un subproceso
  serverProcess = spawn({
    cmd: ["bun", "index.ts"],
    cwd: path.resolve(__dirname, ".."),
    env: { ...process.env, PORT: BASE_PORT.toString() },
    stdout: "inherit",
    stderr: "inherit",
  });

  // Espera a que el servidor esté listo (puedes mejorar esto con un healthcheck real)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Usa el token de admin para autenticación en los tests
  adminToken = ADMIN_TOKEN;
});

describe("Tokens API", () => {
  it("should create an API token", async () => {
    const res = await fetch(`${BASE_URL}/api/tokens`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "integration-token" }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("integration-token");
    expect(typeof data.token).toBe("string");
    expect(data.id).toBeDefined();
    createdTokenId = data.id;
    createdToken = data.token;
  });

  it("should list API tokens and include the created token", async () => {
    const res = await fetch(`${BASE_URL}/api/tokens`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.some((t: any) => t.id === createdTokenId)).toBe(true);
  });

  it("should allow using the created token to access protected endpoints", async () => {
    // Usar el token recién creado para acceder a /api/features (GET)
    const res = await fetch(`${BASE_URL}/api/features`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${createdToken}`,
      },
    });
    // Puede ser 200 (si hay features) o 200 con array vacío
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("should delete the created API token", async () => {
    const res = await fetch(`${BASE_URL}/api/tokens/${createdTokenId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(res.status).toBe(204);
  });

  it("should not find the deleted token in the list", async () => {
    const res = await fetch(`${BASE_URL}/api/tokens`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.some((t: any) => t.id === createdTokenId)).toBe(false);
  });
});

afterAll(async () => {
  // Detén el servidor de Bun
  if (serverProcess) serverProcess.kill();
});
