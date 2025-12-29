import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { spawn } from "bun";
import path from "path";

const BASE_PORT = 3456;
const BASE_URL = `http://localhost:${BASE_PORT}`;
let token: string;
let featureId: number;
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

  // Crea un token de prueba usando el endpoint de tokens
  const res = await fetch(`${BASE_URL}/api/tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "integration-test-token" }),
  });
  expect(res.status).toBe(201);
  const data = await res.json();
  token = data.token;
});

describe("Features API", () => {
  it("should create a feature", async () => {
    const res = await fetch(`${BASE_URL}/api/features`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "test-feature", value: "true" }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("test-feature");
    expect(data.value).toBe("true");
    featureId = data.id;
  });

  it("should list features", async () => {
    const res = await fetch(`${BASE_URL}/api/features`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.some((f: any) => f.id === featureId)).toBe(true);
  });

  it("should get a feature by id", async () => {
    const res = await fetch(`${BASE_URL}/api/features/${featureId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe(featureId);
    expect(data.name).toBe("test-feature");
  });

  it("should update a feature", async () => {
    const res = await fetch(`${BASE_URL}/api/features/${featureId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: "false" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.value).toBe("false");
  });

  it("should delete a feature", async () => {
    const res = await fetch(`${BASE_URL}/api/features/${featureId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(204);
  });
});

afterAll(async () => {
  // Detén el servidor de Bun
  if (serverProcess) serverProcess.kill();
});
